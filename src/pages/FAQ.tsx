import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { wikiUrl } from '../i18n/wiki';

export default function FAQ() {
  const { t, locale } = useI18n();

  return (
    <div className="mx-auto max-w-4xl">
      {/* Title + intro */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {t('formulas.title' as any)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          {t('formulas.intro' as any)
            .split('{link}')
            .map((part: string, i: number) =>
              i === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i}>
                  <a
                    href={wikiUrl('infoTheory', locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                  >
                    {t('formulas.intro.link' as any)}
                  </a>
                  {part.split('{em}').map((subpart: string, j: number) =>
                    j === 0 ? (
                      <span key={j}>{subpart}</span>
                    ) : (
                      <span key={j}>
                        <em>{t('formulas.intro.em' as any)}</em>
                        {subpart}
                      </span>
                    ),
                  )}
                </span>
              ),
            )}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Notation primer */}
      {/* ------------------------------------------------------------------ */}
      <details className="group mb-6 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm sm:mb-8">
        <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 sm:px-6 sm:py-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-base font-bold text-amber-700 sm:h-9 sm:w-9">
            ?
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
              {t('faq.notation.title' as any)}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              {t('faq.notation.intro' as any)}
            </p>
          </div>
          <ChevronIcon />
        </summary>
        <div className="border-t border-amber-200 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <div className="space-y-4">
            <NotationItem
              symbol={t('faq.notation.prob.symbol' as any)}
              name={t('faq.notation.prob.name' as any)}
              desc={t('faq.notation.prob.desc' as any)}
            />
            <NotationItem
              symbol={t('faq.notation.log.symbol' as any)}
              name={t('faq.notation.log.name' as any)}
              desc={t('faq.notation.log.desc' as any)}
            />
            <NotationItem
              symbol={t('faq.notation.sigma.symbol' as any)}
              name={t('faq.notation.sigma.name' as any)}
              desc={t('faq.notation.sigma.desc' as any)}
            />
            <NotationItem
              symbol={t('faq.notation.bit.symbol' as any)}
              name={t('faq.notation.bit.name' as any)}
              desc={t('faq.notation.bit.desc' as any)}
            />
          </div>
        </div>
      </details>

      {/* ------------------------------------------------------------------ */}
      {/* Formula 1: Information Content */}
      {/* ------------------------------------------------------------------ */}
      <FormulaAccordion
        num={1}
        color="blue"
        title={
          <a
            href={wikiUrl('infoContent', locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline decoration-blue-300 hover:text-blue-900"
          >
            {t('faq.ic.title' as any)}
          </a>
        }
        subtitle={t('faq.ic.subtitle' as any)}
        formula={<>I(x) = −log&#8322; p(x)</>}
        formulaNote={
          t('faq.ic.formulaNote' as any)
            .split('{bits}')
            .map((part: string, i: number) =>
              i === 0 ? (
                <span key={i}>{part}</span>
              ) : (
                <span key={i}>
                  <a
                    href={wikiUrl('bit', locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                  >
                    bits
                  </a>
                  {part}
                </span>
              ),
            )
        }
        formulaBg="from-blue-50 to-indigo-50"
      >
        {/* Intuition */}
        <div className="mb-5 sm:mb-6">
          <h4 className="mb-2 text-sm font-semibold text-slate-800 sm:text-base">
            {t('faq.ic.intuition' as any)}
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.ic.intuition.p1' as any)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.ic.intuition.p2' as any)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.ic.intuition.p3' as any)}
          </p>
        </div>

        {/* Examples */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800 sm:text-base">
            {t('faq.ic.examples' as any)}
          </h4>
          <div className="space-y-3">
            <ExampleCard
              emoji="&#x1FA99;"
              title={t('faq.ic.ex1.title' as any)}
              detail={t('faq.ic.ex1.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3B2;"
              title={t('faq.ic.ex2.title' as any)}
              detail={t('faq.ic.ex2.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3DB;&#xFE0F;"
              title={t('faq.ic.ex3.title' as any)}
              detail={t('faq.ic.ex3.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3DB;&#xFE0F;"
              title={t('faq.ic.ex4.title' as any)}
              detail={t('faq.ic.ex4.detail' as any)}
            />
            <ExampleCard
              emoji="&#x2600;&#xFE0F;"
              title={t('faq.ic.ex5.title' as any)}
              detail={t('faq.ic.ex5.detail' as any)}
            />
          </div>
        </div>
      </FormulaAccordion>

      {/* ------------------------------------------------------------------ */}
      {/* Formula 2: Shannon Entropy */}
      {/* ------------------------------------------------------------------ */}
      <FormulaAccordion
        num={2}
        color="purple"
        title={
          <a
            href={wikiUrl('entropy', locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 underline decoration-purple-300 hover:text-purple-900"
          >
            {t('faq.h.title' as any)}
          </a>
        }
        subtitle={t('faq.h.subtitle' as any)}
        formula={<>H = −&nbsp;&#8721;&nbsp;p(x)&nbsp;log&#8322;&nbsp;p(x)</>}
        formulaNote={t('faq.h.formulaNote' as any)}
        formulaBg="from-purple-50 to-fuchsia-50"
      >
        <div className="mb-5 sm:mb-6">
          <h4 className="mb-2 text-sm font-semibold text-slate-800 sm:text-base">
            {t('faq.ic.intuition' as any)}
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.h.intuition.p1' as any)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.h.intuition.p2' as any)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.h.intuition.p3' as any)}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800 sm:text-base">
            {t('faq.h.examples' as any)}
          </h4>
          <div className="space-y-3">
            <ExampleCard
              emoji="&#x1FA99;"
              title={t('faq.h.ex1.title' as any)}
              detail={t('faq.h.ex1.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1FA99;"
              title={t('faq.h.ex2.title' as any)}
              detail={t('faq.h.ex2.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3B2;"
              title={t('faq.h.ex3.title' as any)}
              detail={t('faq.h.ex3.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F1EB;&#x1F1F7;"
              title={t('faq.h.ex4.title' as any)}
              detail={t('faq.h.ex4.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3DB;&#xFE0F;"
              title={t('faq.h.ex5.title' as any)}
              detail={t('faq.h.ex5.detail' as any)}
            />
          </div>
        </div>

        {/* Yes/No game concrete example */}
        <div className="mt-5 rounded-lg border border-purple-200 bg-purple-50/60 p-4 sm:mt-6 sm:p-5">
          <h4 className="mb-3 text-sm font-semibold text-purple-900 sm:text-base">
            {t('faq.h.game.title' as any)}
          </h4>
          <p className="mb-3 text-xs leading-relaxed text-purple-800 sm:text-sm">
            {(() => {
              const raw = t('faq.h.game.intro' as any);
              const parts = raw.split('{binarySearch}');
              if (parts.length < 2) return raw;
              return (
                <>
                  {parts[0]}
                  <a href={wikiUrl('binarySearch', locale)} target="_blank" rel="noopener noreferrer" className="underline decoration-purple-400 hover:text-purple-950">
                    {t('faq.h.game.binarySearch' as any)}
                  </a>
                  {parts[1]}
                </>
              );
            })()}
          </p>

          {/* Scenario: guessing a letter */}
          <div className="space-y-2">
            {/* Round 1: common letter */}
            <div className="rounded-lg bg-white p-3 sm:p-4">
              <p className="mb-2 text-xs font-semibold text-slate-800 sm:text-sm">
                {t('faq.h.game.round1.title' as any)}
              </p>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-600 sm:text-xs">
                <p>
                  <span className="font-semibold text-purple-700">Q1 :</span>{' '}
                  {t('faq.h.game.round1.q1' as any)}
                  <span className="ml-2 font-sans font-semibold text-green-700">
                    {t('faq.h.game.yes' as any)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-purple-700">Q2 :</span>{' '}
                  {t('faq.h.game.round1.q2' as any)}
                  <span className="ml-2 font-sans font-semibold text-green-700">
                    {t('faq.h.game.yes' as any)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-purple-700">Q3 :</span>{' '}
                  {t('faq.h.game.round1.q3' as any)}
                  <span className="ml-2 font-sans font-semibold text-green-700">
                    {t('faq.h.game.yes' as any)}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
                {t('faq.h.game.round1.result' as any)}
              </p>
            </div>

            {/* Round 2: rare letter */}
            <div className="rounded-lg bg-white p-3 sm:p-4">
              <p className="mb-2 text-xs font-semibold text-slate-800 sm:text-sm">
                {t('faq.h.game.round2.title' as any)}
              </p>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-600 sm:text-xs">
                <p>
                  <span className="font-semibold text-purple-700">Q1 :</span>{' '}
                  {t('faq.h.game.round2.q1' as any)}
                  <span className="ml-2 font-sans font-semibold text-red-600">
                    {t('faq.h.game.no' as any)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-purple-700">Q2 :</span>{' '}
                  {t('faq.h.game.round2.q2' as any)}
                  <span className="ml-2 font-sans font-semibold text-red-600">
                    {t('faq.h.game.no' as any)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-purple-700">Q3 :</span>{' '}
                  {t('faq.h.game.round2.q3' as any)}
                  <span className="ml-2 font-sans font-semibold text-red-600">
                    {t('faq.h.game.no' as any)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-purple-700">Q4 :</span>{' '}
                  {t('faq.h.game.round2.q4' as any)}
                  <span className="ml-2 font-sans font-semibold text-red-600">
                    {t('faq.h.game.no' as any)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-purple-700">Q5 :</span>{' '}
                  {t('faq.h.game.round2.q5' as any)}
                  <span className="ml-2 font-sans font-semibold text-green-700">
                    {t('faq.h.game.yes' as any)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-purple-700">Q6 :</span>{' '}
                  {t('faq.h.game.round2.q6' as any)}
                  <span className="ml-2 font-sans font-semibold text-green-700">
                    {t('faq.h.game.yes' as any)}
                  </span>
                </p>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
                {t('faq.h.game.round2.result' as any)}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-purple-800 sm:text-sm">
            {t('faq.h.game.conclusion' as any)}
          </p>
        </div>

        <div className="mt-5 rounded-lg bg-purple-50 p-4 sm:mt-6">
          <h4 className="mb-2 text-sm font-semibold text-purple-900">
            {t('faq.h.why.title' as any)}
          </h4>
          <p className="text-sm leading-relaxed text-purple-800">
            {t('faq.h.why.text' as any)}
          </p>
        </div>
      </FormulaAccordion>

      {/* ------------------------------------------------------------------ */}
      {/* Formula 3: Mutual Information */}
      {/* ------------------------------------------------------------------ */}
      <FormulaAccordion
        num={3}
        color="green"
        title={
          <a
            href={wikiUrl('mutualInfo', locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 underline decoration-green-300 hover:text-green-900"
          >
            {t('faq.mi.title' as any)}
          </a>
        }
        subtitle={t('faq.mi.subtitle' as any)}
        formula={
          <>
            I(X;Y) = &#8721; p(x,y)&nbsp;log&#8322;&nbsp;
            <span className="inline-block">
              <span className="relative inline-block align-middle">
                <span className="block border-b border-slate-500 px-1">p(x,y)</span>
                <span className="block px-1">p(x)·p(y)</span>
              </span>
            </span>
          </>
        }
        formulaNote={t('faq.mi.formulaNote' as any)}
        formulaBg="from-green-50 to-emerald-50"
      >
        <div className="mb-5 sm:mb-6">
          <h4 className="mb-2 text-sm font-semibold text-slate-800 sm:text-base">
            {t('faq.ic.intuition' as any)}
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.mi.intuition.p1' as any)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.mi.intuition.p2' as any)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
            {t('faq.mi.intuition.p3' as any)}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800 sm:text-base">
            {t('faq.mi.examples' as any)}
          </h4>
          <div className="space-y-3">
            <ExampleCard
              emoji="&#x1F1EB;&#x1F1F7;"
              title={t('faq.mi.ex1.title' as any)}
              detail={t('faq.mi.ex1.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3DB;&#xFE0F;"
              title={t('faq.mi.ex2.title' as any)}
              detail={t('faq.mi.ex2.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F1EC;&#x1F1E7;"
              title={t('faq.mi.ex3.title' as any)}
              detail={t('faq.mi.ex3.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3DB;&#xFE0F;"
              title={t('faq.mi.ex4.title' as any)}
              detail={t('faq.mi.ex4.detail' as any)}
            />
            <ExampleCard
              emoji="&#x1F3B2;"
              title={t('faq.mi.ex5.title' as any)}
              detail={t('faq.mi.ex5.detail' as any)}
            />
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-green-50 p-4 sm:mt-6">
          <h4 className="mb-2 text-sm font-semibold text-green-900">
            {t('faq.mi.why.title' as any)}
          </h4>
          <p className="text-sm leading-relaxed text-green-800">
            {t('faq.mi.why.text' as any)}
          </p>
        </div>
      </FormulaAccordion>

      {/* ------------------------------------------------------------------ */}
      {/* Summary table */}
      {/* ------------------------------------------------------------------ */}
      <section className="mb-8 sm:mb-10">
        <h3 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">
          {t('faq.summary.title' as any)}
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 sm:px-4 sm:text-sm">
                  {t('faq.summary.formula' as any)}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 sm:px-4 sm:text-sm">
                  {t('faq.summary.measures' as any)}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 sm:px-4 sm:text-sm">
                  {t('faq.summary.analogy' as any)}
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 sm:px-4 sm:text-sm">
                  {t('faq.summary.unit' as any)}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-3 py-3 font-mono text-xs text-blue-700 sm:px-4 sm:text-sm">
                  I(x) = −log₂ p(x)
                </td>
                <td className="px-3 py-3 text-xs text-slate-700 sm:px-4 sm:text-sm">
                  {t('faq.summary.ic.measures' as any)}
                </td>
                <td className="px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">
                  {t('faq.summary.ic.analogy' as any)}
                </td>
                <td className="px-3 py-3 text-xs text-slate-700 sm:px-4 sm:text-sm">
                  bits
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="px-3 py-3 font-mono text-xs text-purple-700 sm:px-4 sm:text-sm">
                  H = −Σ p(x) log₂ p(x)
                </td>
                <td className="px-3 py-3 text-xs text-slate-700 sm:px-4 sm:text-sm">
                  {t('faq.summary.h.measures' as any)}
                </td>
                <td className="px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">
                  {t('faq.summary.h.analogy' as any)}
                </td>
                <td className="px-3 py-3 text-xs text-slate-700 sm:px-4 sm:text-sm">
                  bits/symbol
                </td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-mono text-xs text-green-700 sm:px-4 sm:text-sm">
                  I(X;Y) = Σ p(x,y) log₂ ...
                </td>
                <td className="px-3 py-3 text-xs text-slate-700 sm:px-4 sm:text-sm">
                  {t('faq.summary.mi.measures' as any)}
                </td>
                <td className="px-3 py-3 text-xs text-slate-600 sm:px-4 sm:text-sm">
                  {t('faq.summary.mi.analogy' as any)}
                </td>
                <td className="px-3 py-3 text-xs text-slate-700 sm:px-4 sm:text-sm">
                  bits
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Try it yourself */}
      {/* ------------------------------------------------------------------ */}
      <section className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-8 text-center sm:px-8 sm:py-10">
        <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
          {t('faq.cta.title' as any)}
        </h3>
        <p className="mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
          {t('faq.cta.text' as any)}
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link
            to="/library"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 sm:px-6 sm:py-3"
          >
            {t('faq.cta.analyze' as any)}
          </Link>
          <Link
            to="/compare"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:px-6 sm:py-3"
          >
            {t('faq.cta.compare' as any)}
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Further reading */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-8 sm:mt-10">
        <h3 className="mb-3 text-sm font-semibold text-slate-700 sm:text-base">
          {t('faq.further.title' as any)}
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li>
            <a
              href={wikiUrl('mathTheory', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.paper' as any)}
            </a>{' '}
            — {t('faq.further.paperDesc' as any)}
          </li>
          <li>
            <a
              href={wikiUrl('entropy', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.entropy' as any)}
            </a>{' '}
            — {t('faq.further.entropyDesc' as any)}
          </li>
          <li>
            <a
              href={wikiUrl('infoTheory', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.infoTheory' as any)}
            </a>{' '}
            — {t('faq.further.infoTheoryDesc' as any)}
          </li>
          <li>
            <a
              href={wikiUrl('shannon', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.shannon' as any)}
            </a>{' '}
            — {t('faq.further.shannonDesc' as any)}
          </li>
        </ul>

        <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-700 sm:text-base">
          {t('faq.further.videos' as any)}
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li>
            <a
              href="https://www.youtube.com/watch?v=v68zYyaEmEA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.3b1b' as any)}
            </a>{' '}
            — {t('faq.further.3b1bDesc' as any)}{' '}
            <span className="text-slate-400">(EN, 3Blue1Brown)</span>
          </li>
          <li>
            <a
              href="https://www.khanacademy.org/computing/computer-science/informationtheory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.khan' as any)}
            </a>{' '}
            — {t('faq.further.khanDesc' as any)}{' '}
            <span className="text-slate-400">(EN, Khan Academy)</span>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=kD5DHGbkYz0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.passeSci' as any)}
            </a>{' '}
            — {t('faq.further.passeSciDesc' as any)}{' '}
            <span className="text-slate-400">(FR, Passe-Science)</span>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=rmBFaNgg4wk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.visElec' as any)}
            </a>{' '}
            — {t('faq.further.visElecDesc' as any)}{' '}
            <span className="text-slate-400">(EN, Visual Electric)</span>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=lr2wyyKCRRM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.esotero' as any)}
            </a>{' '}
            — {t('faq.further.esoteroDesc' as any)}{' '}
            <span className="text-slate-400">(EN, Esoterogeny)</span>
          </li>
          <li>
            <a
              href="https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.ogPaper' as any)}
            </a>{' '}
            — {t('faq.further.ogPaperDesc' as any)}{' '}
            <span className="text-slate-400">(EN, PDF)</span>
          </li>
        </ul>

        <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-700 sm:text-base">
          {t('faq.further.academic' as any)}
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li>
            <a
              href="https://www.princeton.edu/~wbialek/rome/refs/shannon_51.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.shannon51' as any)}
            </a>{' '}
            — {t('faq.further.shannon51Desc' as any)}{' '}
            <span className="text-slate-400">(PDF)</span>
          </li>
          <li>
            <a
              href="https://www.mdpi.com/1099-4300/19/6/275"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.bentz' as any)}
            </a>{' '}
            — {t('faq.further.bentzDesc' as any)}{' '}
            <span className="text-slate-400">(open access)</span>
          </li>
          <li>
            <a
              href="https://journals.plos.org/complexsystems/article?id=10.1371/journal.pcsy.0000032"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.koplenig' as any)}
            </a>{' '}
            — {t('faq.further.koplenigDesc' as any)}{' '}
            <span className="text-slate-400">(open access)</span>
          </li>
          <li>
            <a
              href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0019875"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
            >
              {t('faq.further.montemurro' as any)}
            </a>{' '}
            — {t('faq.further.montemurroDesc' as any)}{' '}
            <span className="text-slate-400">(open access)</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reusable components                                                       */
/* -------------------------------------------------------------------------- */

const colorMap = {
  blue: {
    badge: 'bg-blue-100 text-blue-700',
    border: 'border-slate-200',
  },
  purple: {
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-slate-200',
  },
  green: {
    badge: 'bg-green-100 text-green-700',
    border: 'border-slate-200',
  },
} as const;

function FormulaAccordion({
  num,
  color,
  title,
  subtitle,
  formula,
  formulaNote,
  formulaBg,
  children,
}: {
  num: number;
  color: keyof typeof colorMap;
  title: React.ReactNode;
  subtitle: string;
  formula: React.ReactNode;
  formulaNote: React.ReactNode;
  formulaBg: string;
  children: React.ReactNode;
}) {
  const c = colorMap[color];

  return (
    <details className={`group mb-6 rounded-xl border ${c.border} bg-white shadow-sm sm:mb-8`}>
      <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-10 sm:w-10 sm:text-base ${c.badge}`}
        >
          {num}
        </span>
        <div className="flex-1">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            {title} — {subtitle}
          </h3>
          {/* Formula preview in collapsed state */}
          <p className="mt-1 font-mono text-xs text-slate-500 group-open:hidden sm:text-sm">
            {formula}
          </p>
        </div>
        <ChevronIcon />
      </summary>

      <div className="border-t border-slate-200 px-5 pb-5 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
        {/* Formula (full) */}
        <div
          className={`mb-5 rounded-lg bg-gradient-to-r ${formulaBg} px-4 py-4 text-center sm:mb-6 sm:px-6 sm:py-5`}
        >
          <span className="font-mono text-lg text-slate-800 sm:text-2xl">{formula}</span>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">{formulaNote}</p>
        </div>

        {children}
      </div>
    </details>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function NotationItem({
  symbol,
  name,
  desc,
}: {
  symbol: string;
  name: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 rounded-lg border border-amber-100 bg-white p-3 sm:p-4">
      <span className="mt-0.5 shrink-0 font-mono text-lg font-bold text-amber-700 sm:text-xl">
        {symbol}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-800">{name}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{desc}</p>
      </div>
    </div>
  );
}

function ExampleCard({
  emoji,
  title,
  detail,
}: {
  emoji: string;
  title: string;
  detail: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:p-4">
      <span className="mt-0.5 shrink-0 text-lg">{emoji}</span>
      <div>
        <p className="mb-1 text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{detail}</p>
      </div>
    </div>
  );
}
