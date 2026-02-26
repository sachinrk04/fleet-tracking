declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// Allow importing CSS modules with typed class names (optional)
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
