"use client";
import { useEffect, useRef, useState } from "react";
import { finderCopy, previewStyles, validFinderResult, type FinderLocale, type FinderStyle, type FinderResult } from "./style-finder";

export function useStyleFinder(locale: FinderLocale, styles: FinderStyle[], base = "") {
 const [description, setDescription] = useState("");
 const [answer, setAnswer] = useState("");
 const [result, setResult] = useState<FinderResult | null>(null);
 const [mode, setMode] = useState<"checking"|"preview"|"ai">("checking");
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState("");
 const request = useRef<AbortController | null>(null);
 const version = useRef(0);
 const c = finderCopy[locale];
 useEffect(() => {
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),5000);
  fetch(base+"/api/style-finder",{signal:controller.signal}).then(r=>r.ok?r.json():null).then(v=>setMode(v?.mode === "ai" ? "ai" : "preview")).catch(()=>setMode("preview")).finally(()=>clearTimeout(timer));
  return ()=>{controller.abort(); clearTimeout(timer);};
 },[base]);
 useEffect(()=>{ version.current++; request.current?.abort(); setResult(null); setAnswer(""); setError(""); setBusy(false); },[locale]);
 useEffect(()=>()=>{version.current++;request.current?.abort();},[]);
 function edit(value: string) { version.current++; request.current?.abort(); setBusy(false); setDescription(value); setResult(null); setAnswer(""); setError(""); }
 async function run(refine=false) {
  if (busy || mode === "checking") return;
  if (description.trim().length < 10 || description.length > 1200) {setError(c.invalid); return;}
  if (refine && (!answer.trim() || answer.length > 300)) {setError(c.answerInvalid); return;}
  const input = description + (refine ? "\n" + answer : "");
  const ticket=++version.current;
  const controller = new AbortController(); request.current=controller;
  setBusy(true); setError("");
  const timer=setTimeout(()=>controller.abort(),20000);
  try {
   let next: FinderResult;
   if (mode === "preview") next=previewStyles(input,locale,styles);
   else {
    const response=await fetch(base+"/api/style-finder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:input,locale}),signal:controller.signal});
    if(!response.ok) throw Error("Request failed");
    const data:unknown=await response.json();
    if(!validFinderResult(data,styles.map(s=>s.id))) throw Error("Invalid result");
    next=data;
   }
   if(version.current===ticket) {setResult(next);setAnswer("");}
  } catch { if(version.current===ticket) setError(c.error); }
  finally {clearTimeout(timer);if(version.current===ticket) setBusy(false);}
 }
 return {description,edit,answer,setAnswer,result,mode,busy,error,run,c};
}
