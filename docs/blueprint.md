# **App Name**: Kizaru Panel

## Core Features:

- Login Authentication: Secure user access with password verification and device type validation.
- System Selection: Allow users to select either Android or iOS platform for sensitivity generation.
- Sensitivity Type Selection: Require users to select a sensitivity level (Low, Medium, High) to tailor the configuration.
- Sensitivity Generation: Generate optimized sensitivity settings based on user-selected preferences, considering system type and desired sensitivity level.
- Android Configuration Generation: Randomly generate realistic Android configurations (DPI, cursor speed, animation scale) that respect sensitivity type and display configurations using native-looking UI components.
- iOS Configuration Generation: Generate configuration for iOS based on parameters: scan settings, pause settings, movement repetition and others, all appropriate to the requested sensitivity. Values should follow sensitivity requested
- Time Lock: Impose a cool-down period after each sensitivity generation to prevent rapid requests and to prevent the LLM tool from overgenerating, managed locally within the app.

## Style Guidelines:

- Background color: Black (#000000) for a premium gamer aesthetic.
- Text color: White (#FFFFFF) for clear readability against the dark background.
- Accent color: Neon pink (#FF007F) to highlight key elements and interactive components, aligning with the specified visual identity.
- Body and headline font: 'Inter', a grotesque-style sans-serif, offering a modern look that suits both headlines and body text.
- Animated background with falling neon pink hacker-style code, providing a subtle and continuous effect without obstructing readability.
- Mobile-first layout design ensuring a clean, organized, and intuitive user experience across various screen sizes.
- Use icons which appear as part of real iOS or Android.