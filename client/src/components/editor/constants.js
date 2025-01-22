// Section Types
export const SECTION_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  BUTTON: "button",
};

// Default Styles
export const DEFAULT_STYLES = {
  fontSize: "16px",
  color: "#000000",
  textAlign: "left",
  backgroundColor: "#ffffff",
  padding: "20px",
  width: "100%",
  borderRadius: "0px",
  margin: "0px",
};

export const BUTTON_DEFAULT_STYLES = {
  ...DEFAULT_STYLES,
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "4px",
  width: "auto",
  textAlign: "center",
};

export const DEFAULT_TEMPLATE = {
  title: "",
  sections: [
    {
      type: SECTION_TYPES.TEXT,
      content: "Welcome to your new email template!",
      styles: {
        ...DEFAULT_STYLES,
        fontSize: "24px",
        textAlign: "center",
        padding: "20px",
      },
    },
    {
      type: SECTION_TYPES.TEXT,
      content: "Start editing this template by adding or modifying sections.",
      styles: {
        ...DEFAULT_STYLES,
        textAlign: "center",
        padding: "15px",
      },
    },
  ],
  footer: " 2025 Your Company. All rights reserved.",
};
