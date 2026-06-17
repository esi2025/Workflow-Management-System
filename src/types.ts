export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'dropdown' | 'textarea' | 'checkbox';
  required: boolean;
  options?: string[]; // For dropdown type
}

export interface FormTemplate {
  id: string;
  title: string;
  unit: string;
  fields: FormField[];
  createdAt: string;
}

export interface User {
  id: string;
  code: string; // Dynamic code (e.g. 1001)
  name: string;
  role: 'admin' | 'staff' | 'supervisor' | 'manager' | 'president';
  unit: string; // e.g., 'حسابداری', 'واحد فنی', 'فروش', 'منابع انسانی', 'عمومی'
  passwordHint: string;
}

export interface FormSubmission {
  id: string;
  templateId: string;
  templateTitle: string;
  unit: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  createdAt: string;
  fieldsData: Record<string, any>;
  attachment?: {
    name: string;
    size: string;
    type: string;
  } | null;
  
  // Reviewers comments & logs
  supervisorComment: string | null;
  supervisorApprovedAt: string | null;
  supervisorName: string | null;
  
  managerComment: string | null;
  managerApprovedAt: string | null;
  managerName: string | null;
  
  presidentComment: string | null;
  presidentApprovedAt: string | null;
  presidentName: string | null;
  
  status: 'draft' | 'sent_to_supervisor' | 'sent_to_manager' | 'sent_to_president' | 'approved_by_president';
  startTime?: string;
  endTime?: string;
  rating?: number; // Star rating (1-5) given during reviews
  logs?: {
    id: string;
    userName: string;
    userRole: string;
    action: 'create' | 'view' | 'approve' | 'edit_or_update' | 'reject';
    actionLabel: string;
    timestamp: string; // ISO string or Gregorian date
    comment?: string | null;
  }[];
}

export interface StageDeadline {
  value: number;
  unit: 'm' | 'h' | 'd'; // minute, hour, day
}

export interface WorkflowDeadlines {
  supervisor: StageDeadline;
  manager: StageDeadline;
  president: StageDeadline;
}

