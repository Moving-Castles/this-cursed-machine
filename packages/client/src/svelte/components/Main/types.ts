export type TabDefinition = {
    label: string;
    component: any;
    enabled: boolean;
}

export type TabDefinitions = {
    [key: number]: TabDefinition;
}