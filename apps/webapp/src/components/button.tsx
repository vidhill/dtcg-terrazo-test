import classNames from "./index.module.css";

function Button({ children }: React.PropsWithChildren) {
  return <button className={classNames.button}>{children}</button>;
}

export { Button };
