'use client';

import { FormSchema, FormFieldSchema, FieldType } from '@/types/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const FIELD_TYPES: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' },
];

const OPTIONS_TYPES: FieldType[] = ['select', 'radio'];

interface FieldEditorProps {
    schema: FormSchema;
    onChange: (schema: FormSchema) => void;
}

function makeFieldId(existing: FormFieldSchema[]): string {
    let n = existing.length + 1;
    let id = `field${n}`;
    while (existing.some(f => f.id === id)) {
        n += 1;
        id = `field${n}`;
    }
    return id;
}

export function FieldEditor({ schema, onChange }: FieldEditorProps) {
    const updateField = (index: number, patch: Partial<FormFieldSchema>) => {
        const fields = schema.fields.map((f, i) => (i === index ? { ...f, ...patch } : f));
        onChange({ ...schema, fields });
    };

    const removeField = (index: number) => {
        onChange({ ...schema, fields: schema.fields.filter((_, i) => i !== index) });
    };

    const moveField = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= schema.fields.length) return;
        const fields = [...schema.fields];
        [fields[index], fields[target]] = [fields[target], fields[index]];
        onChange({ ...schema, fields });
    };

    const addField = () => {
        const newField: FormFieldSchema = {
            id: makeFieldId(schema.fields),
            label: 'New Field',
            type: 'text',
            required: false,
        };
        onChange({ ...schema, fields: [...schema.fields, newField] });
    };

    const updateOptionsText = (index: number, text: string) => {
        const options = text
            .split(',')
            .map(part => part.trim())
            .filter(Boolean)
            .map(part => ({ value: part, label: part }));
        updateField(index, { options });
    };

    return (
        <div className="space-y-4">
            {schema.fields.map((field, index) => (
                <div key={field.id} className="border border-border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text-muted">Field {index + 1}</span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => moveField(index, -1)}
                                disabled={index === 0}
                                className="p-1 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Move field up"
                            >
                                ↑
                            </button>
                            <button
                                type="button"
                                onClick={() => moveField(index, 1)}
                                disabled={index === schema.fields.length - 1}
                                className="p-1 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Move field down"
                            >
                                ↓
                            </button>
                            <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="p-1 text-error-text hover:opacity-70"
                                aria-label="Remove field"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Label"
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                        />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-text">Type</label>
                            <select
                                value={field.type}
                                onChange={(e) => updateField(index, { type: e.target.value as FieldType })}
                                className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                {FIELD_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Placeholder"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                    />

                    {OPTIONS_TYPES.includes(field.type) && (
                        <Input
                            label="Options (comma-separated)"
                            value={(field.options || []).map(o => o.label).join(', ')}
                            onChange={(e) => updateOptionsText(index, e.target.value)}
                            placeholder="Option 1, Option 2, Option 3"
                        />
                    )}

                    <label className="flex items-center gap-2 text-sm text-text">
                        <input
                            type="checkbox"
                            checked={!!field.required}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                        />
                        Required
                    </label>
                </div>
            ))}

            <Button type="button" variant="outline" size="sm" onClick={addField} className="w-full">
                + Add Field
            </Button>
        </div>
    );
}
