// This file tells TypeScript how to handle CSS imports
// You can add more file types as needed
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
