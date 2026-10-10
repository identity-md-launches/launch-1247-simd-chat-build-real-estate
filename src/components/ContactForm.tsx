import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { siteConfig } from "../site-config";
import { Icon } from "./Icon";

interface ContactValues {
  name: string;
  email: string;
  interest: string;
  message: string;
}
export function ContactForm({
  interest,
  onInterestChange,
}: {
  interest: string;
  onInterestChange: (value: string) => void;
}) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactValues, string>>
  >({});
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setDraft("");
    setCopied("");
  }, [interest]);
  function update(key: keyof typeof values, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setDraft("");
    setCopied("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    if (values.name.trim().length < 2)
      next.name = "Adınızı ve soyadınızı yazın (en az 2 karakter).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Geçerli bir e-posta adresi yazın.";
    if (values.message.trim().length < 10)
      next.message = "İhtiyacınızı en az 10 karakterle açıklayın.";
    setErrors(next);
    if (Object.keys(next).length) {
      setDraft("");
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const text = `24 GYO — Gayrimenkul talebi\n\nAd soyad: ${values.name.trim()}\nE-posta: ${values.email.trim()}\nİlgi alanı: ${interest}\n\n${values.message.trim()}`;
    setDraft(text);
    setCopied("");
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", draft], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "24-gyo-talep.txt";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied("Talep metni kopyalandı. Henüz iletilmedi.");
    } catch {
      setCopied("Kopyalama kullanılamıyor. Talep dosyasını indirebilirsiniz.");
    }
  }
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-topline">
        <span className="eyebrow">Birlikte başlayalım</span>
        <Icon name="arrow-up" size={25} />
      </div>
      <h3>Size nasıl yardımcı olabiliriz?</h3>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="contact-name">
            Adınız soyadınız <span>(gerekli)</span>
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Adınız ve soyadınız"
            required
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p className="field-error" id="name-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="contact-email">
            E-posta adresiniz <span>(gerekli)</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="ornek@eposta.com"
            required
            maxLength={254}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p className="field-error" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-interest">İlgi alanınız</label>
        <select
          id="contact-interest"
          name="interest"
          value={interest}
          onChange={(e) => {
            onInterestChange(e.target.value);
            setDraft("");
          }}
        >
          <option>Genel bilgi</option>
          <option>Gayrimenkul alım ve satım</option>
          <option>Kiralama danışmanlığı</option>
          <option>Yatırım danışmanlığı</option>
          {interest.startsWith("Mülk:") && <option>{interest}</option>}
        </select>
      </div>
      <div className="field">
        <label htmlFor="contact-message">
          Mesajınız <span>(gerekli)</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={3}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Aradığınız yaşam alanını veya ihtiyacınızı anlatın…"
          required
          minLength={10}
          maxLength={3000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <p className="form-privacy">
        Bilgileriniz bu sayfada kalır; otomatik olarak gönderilmez. Talebinizi
        hazırlayıp indirebilirsiniz.
        {siteConfig.email
          ? " Dilerseniz e-posta uygulamanızla iletebilirsiniz."
          : " İletişim kanalları yakında paylaşılacak."}
      </p>
      <button className="button button-primary form-submit" type="submit">
        Talep oluştur <Icon name="arrow" />
      </button>
      <div role="status" className="sr-only">
        {Object.keys(errors).length > 0
          ? "Lütfen işaretli alanları kontrol edin."
          : ""}
      </div>
      {draft && (
        <div
          className="form-result"
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="result-title"
        >
          <h4 id="result-title">
            <Icon name="check" /> Talebiniz hazır.
          </h4>
          <p>Henüz iletilmedi. Metni kopyalayın veya dosya olarak indirin.</p>
          <div className="result-actions">
            <button
              type="button"
              className="button button-outline"
              onClick={download}
            >
              <Icon name="download" size={17} />
              Talebi indir
            </button>
            <button type="button" className="text-button" onClick={copy}>
              Metni kopyala
            </button>
            {siteConfig.email && (
              <a
                className="text-button"
                href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("24 GYO — Gayrimenkul talebi")}&body=${encodeURIComponent(draft)}`}
              >
                E-posta uygulamasında aç <Icon name="arrow-up" size={16} />
              </a>
            )}
          </div>
          <p role="status" className="copy-status">
            {copied}
          </p>
        </div>
      )}
    </form>
  );
}
