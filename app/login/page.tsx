"use client";

import Link from "next/link";
import { useState } from "react";
import { sendMagicLink } from "@/lib/sync";
import PixelIcon from "../components/PixelIcon";

export default function Login() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const { error } = await sendMagicLink(email.trim());
    if (error) {
      setState("error");
      setMsg(/rate|limit/i.test(error.message) ? "发送太频繁了，请过一会儿再试。" : error.message);
    } else setState("sent");
  };

  if (state === "sent")
    return (
      <div className="space-y-4 py-16 text-center">
        <div className="flex justify-center">
          <PixelIcon name="bubble" size={7} />
        </div>
        <h1 className="text-xl font-extrabold">登录链接已发送</h1>
        <p className="text-sm leading-relaxed text-muted">
          请打开 <b className="text-ink">{email}</b> 收到的邮件，点里面的链接就能登录。
          <br />
          没收到的话，看看垃圾邮件箱。
        </p>
        <button onClick={() => setState("idle")} className="text-sm text-grass-ink underline">
          换一个邮箱
        </button>
      </div>
    );

  return (
    <div className="space-y-6 py-8">
      <div className="flex justify-center">
        <PixelIcon name="bunny" size={6} />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold">登录 / 注册</h1>
        <p className="mt-1 text-sm text-muted">登录后进度会存到云端，手机和电脑自动同步</p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="你的邮箱"
          autoComplete="email"
          className="w-full rounded-2xl border-2 border-line bg-surface px-4 py-4 text-lg outline-none focus:border-grass"
        />
        <button
          disabled={state === "sending"}
          className="btn-3d w-full rounded-2xl bg-grass py-4 text-lg font-extrabold text-white disabled:opacity-60"
        >
          {state === "sending" ? "发送中…" : "发送登录链接"}
        </button>
        {state === "error" && <p className="text-center text-sm text-bad">{msg}</p>}
      </form>
      <p className="text-center text-xs leading-relaxed text-muted">
        不需要密码。第一次使用会自动创建账号，现有的学习进度会合并进去。
        <br />
        <Link href="/" className="underline">
          先不登录，继续学习
        </Link>
      </p>
    </div>
  );
}
