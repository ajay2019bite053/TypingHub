declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: {
        page_title?: string;
        page_location?: string;
        send_page_view?: boolean;
        value?: number;
        event_category?: string;
        event_label?: string;
        custom_parameter?: string;
      }
    ) => void;
  }
}

export {};




