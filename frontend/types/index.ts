export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select';

export interface SelectOption {
    value: string;
    label: string;
}

export interface FormFieldSchema {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: SelectOption[];
}

export interface FormSchema {
    id?: string;
    title: string;
    description?: string;
    fields: FormFieldSchema[];
}

export interface Form {
    id: string;
    title: string;
    schema: FormSchema;
    createdAt: string;
    updatedAt: string;
    submissionCount: number;
}

export interface Submission {
    id: string;
    formId?: string;
    data: Record<string, unknown>;
    createdAt: string;
}

export interface User {
    id: string;
    email: string;
    createdAt: string;
}
