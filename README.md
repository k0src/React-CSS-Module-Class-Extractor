# React CSS Module Class Extractor

VS Code extension that scans the active React or TypeScript file for CSS Module references such as `styles.card`, expands supported template literal forms with TypeScript type information, formats CSS class stubs, and copies the result to the clipboard.

## Command

Run `Extract CSS Module Classes` from the Command Palette, or assign to a keyboard shortcut.

## Supported Files

- `.tsx`
- `.ts`
- `.jsx`
- `.js`

## Supported Syntax

```tsx
styles.card
styles["card"]
styles[`card-${size}`]
styles[`card-${size}-${theme}`]
```

Template literal interpolations expand only when TypeScript resolves them to string literal unions. Unresolved interpolations fall back to the expression name.

## Behavior

Generated stubs are copied to the clipboard and a notification is shown with the number of copied classes.
