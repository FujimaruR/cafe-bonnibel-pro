import { useLocale as useSiteLocale, text as localizeText, t as tr } from '../site/locale';
import { useState } from 'react';
import { track } from '../site/analytics';
import config from '../data/config.json';

export default function Contact() {
  useSiteLocale();
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState(false);
  function submitDemo(event) {
    event.preventDefault();
    track('form_submit_attempt', 'demo-contact');
    if (!event.currentTarget.reportValidity()) { setValidationError(true);
      track('form_validation_error', 'demo-contact', 'validation');
      return;
    }
    setValidationError(false); setSubmitted(true);
    // This is a simulation, never a confirmed commercial delivery.
  }
  const waNumber = config.cta.whatsapp.replace(/\s|\+/g, '');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(localizeText(config.cta.waMessage))}`;

  return (
    <section className="pt-28 md:pt-36 bg-beige/20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-cafe mb-6">{tr("text.d8a53e1f6d")}</h1>
        <form noValidate onSubmit={submitDemo} onChangeCapture={() => track('form_start', 'demo-contact')} className="bg-crema p-6 rounded-2xl border border-beige/70 grid gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm text-cafe/70 mb-1">{tr("text.e68491e91c")}</label>
            <input id="contact-name" required type="text" className="w-full rounded-xl border border-beige/70 px-3 py-2 bg-white" placeholder={tr("text.f07e1b890b")} />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm text-cafe/70 mb-1">{tr("text.98f00c3e0a")}</label>
            <input id="contact-email" required type="email" className="w-full rounded-xl border border-beige/70 px-3 py-2 bg-white" placeholder={tr("text.ff00adf954")} />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm text-cafe/70 mb-1">{tr("text.eb9e23efc4")}</label>
            <textarea id="contact-message" required className="w-full rounded-xl border border-beige/70 px-3 py-2 bg-white" rows="5" placeholder={tr("text.cda56135ac")} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={()=>window.open(waHref,'_blank')} className="px-4 py-2 rounded-xl bg-cafe text-crema">{tr("text.af6ee04096")}</button>
            <button type="submit" className="px-4 py-2 rounded-xl border border-cafe/30">{tr("text.411bd9b198")}</button>
          </div>
          {submitted && <p role="status">{tr("text.a7f5c63f17")}</p>}
          <p className="text-xs text-cafe/60">{tr("text.cf96d3c1f6")}</p>
        {validationError && <p role="alert">{tr('ui.validation')}</p>}
        </form>
      </div>
    </section>
  );
}
