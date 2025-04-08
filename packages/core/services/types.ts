export interface Location {
  latitude: number;
  longitude: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  requiredPhotos: number;
  formFields: FormField[];
  formData?: any;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'photo';
  required: boolean;
  options?: string[];
}

// Original Assignment interface (keeping for backward compatibility)
export interface Assignment {
  id: string;
  clientId: string;
  title: string;
  description: string;
  location: Location;
  status: 'pending' | 'in-progress' | 'completed';
  tasks: Task[];
  scheduledTime: string; // ISO date string
}

export interface Route {
  id: string;
  driverId: string;
  date: string; // ISO date string
  status: 'pending' | 'in-progress' | 'completed';
  assignments: string[]; // Assignment IDs
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  clientId: string;
}

// Client-A specific interfaces
export interface ClientAssignment {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  dockingPoint?: string;
  contactName?: string;
  contactPhone?: string;
  parts?: string;
  orderItems?: string;
  phone?: string;
  notes?: string;
  userId: string;
  companyId: string;
  index: number;
  items: AssignmentItem[];
  expandMode?: boolean;
  showOCRFieldsByDefault?: boolean;
  plannedArrivalTime?: string;
}

export interface AssignmentItem {
  id: string;
  type: AssignmentItemType;
  index: number;
  status: 'initial' | 'in_progress' | 'success' | 'error';
  isOptional: boolean;
  isHidden: boolean;
  isCertificate: boolean;
  assignmentId: string;
  companyId: string;
  form: FormInputField[];
}

export enum AssignmentItemType {
  QrScan = 'QR_SCAN',
  Geolocation = 'GEOLOCATION',
  Photo = 'PHOTO',
  DocScan = 'DOC_SCAN',
  Signature = 'SIGNATURE',
  ShiftStart = 'SHIFT_START',
  ManualReport = 'MANUAL_REPORT',
  PdfSign = 'PDF_SIGN',
  CertificateSignature = 'CERTIFICATE_SIGNATURE',
  OCR = 'OCR',
  Image = 'IMAGE',
}

export interface FormInputField {
  key: string;
  label: string;
  type: FormFieldType;
  editable: boolean;
  required?: boolean;
  hidden?: boolean;
  value?: string | number | boolean | Array<string>;
  validationFunction?: string;
  options?: Array<{ label: string; value: string | number }>;
}

export enum FormFieldType {
  Text = 'TEXT',
  Number = 'NUMBER',
  Date = 'DATE',
  Time = 'TIME',
  Select = 'SELECT',
  MultiSelect = 'MULTI_SELECT',
  Checkbox = 'CHECKBOX',
  TextArea = 'TEXT_AREA',
}
