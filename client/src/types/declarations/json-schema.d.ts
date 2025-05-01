/**
 * Type definitions for JSON Schema
 */

declare module 'json-schema' {
  export interface JSONSchema {
    id?: string;
    $schema?: string;
    title?: string;
    description?: string;
    type?: string | string[];
    properties?: Record<string, JSONSchema>;
    required?: string[];
    additionalProperties?: boolean | JSONSchema;
    items?: JSONSchema | JSONSchema[];
    allOf?: JSONSchema[];
    anyOf?: JSONSchema[];
    oneOf?: JSONSchema[];
    not?: JSONSchema;
    
    // Add any additional schema properties that you need
    [key: string]: any;
  }
}