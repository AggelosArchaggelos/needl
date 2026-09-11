export type ContentIssue = { level: string; location: string; message: string };
export function validateContent(data: { studios: unknown; cities: unknown; styles: unknown; news: unknown; config: unknown }): ContentIssue[];
export function formatReport(issues: ContentIssue[]): string;
