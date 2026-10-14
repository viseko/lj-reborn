import { ThemeSwitcher } from "@/features/theme-switcher/ThemeSwitcher";

export default function Home() {
  return (
    <>
      <h1>LJ Reborn</h1>
      <p>Скоро здесь будет лента</p>
      <ThemeSwitcher />
      <a href="/register">Регистрация</a>
    </>
  );
}
