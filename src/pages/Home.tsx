import { Link } from 'react-router-dom';
import { CorpusBubbleChart } from '../charts/CorpusBubbleChart';
import type { BubbleEntry } from '../charts/CorpusBubbleChart';
import { TimelineChart } from '../charts/TimelineChart';
import type { TimelineEntry } from '../charts/TimelineChart';
import precomputedStats from '../data/precomputed_stats.json';
import { useI18n } from '../i18n/I18nContext';
import { wikiUrl } from '../i18n/wiki';

const bubbleData = precomputedStats as BubbleEntry[];
const timelineData = precomputedStats as TimelineEntry[];

export default function Home() {
  const { t, locale } = useI18n();

  return (
    <div>
      {/* Hero */}
      <section className="mb-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-8 text-white shadow-xl sm:mb-12 sm:rounded-2xl sm:px-8 sm:py-12">
        <blockquote className="mb-5 border-l-4 border-blue-400 pl-3 sm:mb-6 sm:pl-4">
          <p className="text-xs italic leading-relaxed text-slate-300 sm:text-sm">
            {t('home.quote')}
          </p>
          <footer className="mt-2 text-[10px] not-italic text-slate-400 sm:text-xs">
            —{' '}
            <a
              href={wikiUrl('shannon', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-slate-500 hover:text-white"
            >
              Claude Shannon
            </a>
            ,{' '}
            <a
              href={wikiUrl('mathTheory', locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-slate-500 hover:text-white"
            >
              <cite>A Mathematical Theory of Communication</cite>
            </a>
            , 1948
          </footer>
        </blockquote>

        <h2 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {t('home.hero.title').split('{measure}').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <span className="text-blue-400">{t('home.hero.measure')}</span>
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </h2>

        <p className="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {(() => {
            const parts = t('home.hero.text').split(/\{(entropy|surprise|language)\}/);
            return parts.map((part, i) => {
              if (part === 'entropy')
                return (
                  <a
                    key={i}
                    href={wikiUrl('entropy', locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white underline decoration-blue-400 hover:text-blue-300"
                  >
                    {t('home.hero.entropy')}
                  </a>
                );
              if (part === 'surprise')
                return <em key={i}>{t('home.hero.surprise')}</em>;
              if (part === 'language')
                return (
                  <strong key={i} className="text-white">
                    {t('home.hero.language')}
                  </strong>
                );
              return <span key={i}>{part}</span>;
            });
          })()}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
          <Link
            to="/library"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 sm:px-6 sm:py-3"
          >
            {t('home.hero.cta.library')}
          </Link>
          <Link
            to="/library"
            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white sm:px-6 sm:py-3"
          >
            {t('home.hero.cta.analyze')}
          </Link>
          <Link
            to="/compare"
            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white sm:px-6 sm:py-3"
          >
            {t('home.hero.cta.compare')}
          </Link>
          <Link
            to="/formulas"
            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-400 hover:text-white sm:px-6 sm:py-3"
          >
            {t('home.hero.cta.formulas')}
          </Link>
        </div>
      </section>

      {/* Bubble chart */}
      <section className="mb-8 sm:mb-12">
        <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">
          {t('home.bubble.title')}
        </h3>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-600">
          {(() => {
            const parts = t('home.bubble.desc').split(/\{(letterH|wordLen|richness)\}/);
            return parts.map((part, i) => {
              if (part === 'letterH')
                return <strong key={i}>{t('home.bubble.letterH')}</strong>;
              if (part === 'wordLen')
                return <strong key={i}>{t('home.bubble.wordLen')}</strong>;
              if (part === 'richness')
                return <strong key={i}>{t('home.bubble.richness')}</strong>;
              return <span key={i}>{part}</span>;
            });
          })()}
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <CorpusBubbleChart entries={bubbleData} title={t('chart.bubbleTitle')} />
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400 sm:text-xs">
          {t('home.bubble.note')}{' '}
          <Link to="/library" className="text-blue-500 underline hover:text-blue-700">
            {t('home.bubble.cta')}
          </Link>
        </p>
      </section>

      {/* Timeline chart */}
      <section className="mb-8 sm:mb-12">
        <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">
          {t('home.timeline.title')}
        </h3>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-slate-600">
          {t('home.timeline.desc')}
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <TimelineChart
            entries={timelineData}
            title={t('chart.timeline.title')}
            xLabel={t('chart.timeline.period')}
            yLabel={t('chart.timeline.y')}
          />
        </div>
      </section>

      {/* What is Shannon Entropy? */}
      <section className="mb-8 sm:mb-12">
        <h3 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-xl">
          <a
            href={wikiUrl('entropy', locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline decoration-blue-300 hover:text-blue-800"
          >
            {t('home.entropy.title')}
          </a>
        </h3>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <p className="mb-3 text-sm leading-relaxed text-slate-700">
              {(() => {
                const parts = t('home.entropy.text1').split(/\{(qu|e|i|information)\}/);
                return parts.map((part, i) => {
                  if (part === 'qu')
                    return (
                      <span key={i} className="rounded bg-slate-100 px-1 font-mono text-sm">
                        qu
                      </span>
                    );
                  if (part === 'e')
                    return (
                      <span key={i} className="rounded bg-blue-50 px-1 font-mono text-sm text-blue-700">
                        e
                      </span>
                    );
                  if (part === 'i')
                    return (
                      <span key={i} className="rounded bg-blue-50 px-1 font-mono text-sm text-blue-700">
                        i
                      </span>
                    );
                  if (part === 'information')
                    return (
                      <a
                        key={i}
                        href={wikiUrl('infoContent', locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                      >
                        information
                      </a>
                    );
                  return <span key={i}>{part}</span>;
                });
              })()}
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              {t('home.entropy.text2')}
            </p>
            <div className="my-3 overflow-x-auto rounded-lg bg-slate-50 px-3 py-2.5 text-center sm:my-4 sm:px-4 sm:py-3">
              <span className="whitespace-nowrap font-mono text-base text-slate-800 sm:text-lg">
                H = −&nbsp;&#8721;&nbsp;p(x)&nbsp;log&#8322;&nbsp;p(x)
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {(() => {
                const parts = t('home.entropy.text3').split(/\{(H|bits)\}/);
                return parts.map((part, i) => {
                  if (part === 'H') return <strong key={i}>H</strong>;
                  if (part === 'bits')
                    return (
                      <a
                        key={i}
                        href={wikiUrl('bit', locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                      >
                        {t('stats.bits')}
                      </a>
                    );
                  return <span key={i}>{part}</span>;
                });
              })()}{' '}
              <Link to="/formulas" className="text-blue-600 underline hover:text-blue-800">
                {t('home.entropy.seeFormulas')}
              </Link>
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h4 className="mb-3 font-semibold text-slate-800">
              {t('home.entropy.why.title')}
            </h4>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-700">
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-blue-500">&#9679;</span>
                <span>
                  <strong>{t('home.entropy.why.fingerprint')}</strong>{' '}
                  {(() => {
                    const parts = t('home.entropy.why.fingerprint.text').split(/\{(inflection|morphology)\}/);
                    return parts.map((part, i) => {
                      if (part === 'inflection')
                        return (
                          <a
                            key={i}
                            href={wikiUrl('inflection', locale)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                          >
                            {locale === 'fr' ? 'flexion' : locale === 'nl' ? 'flexie' : 'inflection'}
                          </a>
                        );
                      if (part === 'morphology')
                        return (
                          <a
                            key={i}
                            href={wikiUrl('morphology', locale)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                          >
                            {locale === 'fr' ? 'morphologie' : locale === 'nl' ? 'morfologie' : 'morphology'}
                          </a>
                        );
                      return <span key={i}>{part}</span>;
                    });
                  })()}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-blue-500">&#9679;</span>
                <span>
                  <strong>{t('home.entropy.why.bridge')}</strong>{' '}
                  {(() => {
                    const parts = t('home.entropy.why.bridge.text').split(/\{infoTheory\}/);
                    return parts.map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>
                          {part}
                          <a
                            href={wikiUrl('infoTheory', locale)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                          >
                            {t('home.focus.link')}
                          </a>
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    );
                  })()}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Our focus */}
      <section className="mb-8 sm:mb-12">
        <h3 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-xl">
          {t('home.focus.title').split('{link}').map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>
                {part}
                <a
                  href={wikiUrl('infoTheory', locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline decoration-blue-300 hover:text-blue-800"
                >
                  {t('home.focus.link')}
                </a>
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </h3>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="mb-3 text-sm leading-relaxed text-slate-700">
            {(() => {
              const text = t('home.focus.text1');
              const parts = text.split(/\{(nlp|sentiment|ner|pos|topic|mt|embeddings)\}/);
              const wikiMap: Record<string, [string, string]> = {
                nlp: ['nlp', locale === 'fr' ? 'Le traitement automatique des langues (TAL)' : locale === 'nl' ? 'Natuurlijke taalverwerking (NLP)' : 'Natural language processing (NLP)'],
                sentiment: ['sentiment', locale === 'fr' ? "analyse de sentiments" : locale === 'nl' ? 'sentimentanalyse' : 'sentiment analysis'],
                ner: ['ner', locale === 'fr' ? "reconnaissance d'entités nommées" : locale === 'nl' ? 'namedentityherkenning' : 'named entity recognition'],
                pos: ['pos', locale === 'fr' ? "étiquetage morpho-syntaxique" : locale === 'nl' ? 'woordsoortannotatie' : 'part-of-speech tagging'],
                topic: ['topicModel', locale === 'fr' ? "modélisation de thèmes" : locale === 'nl' ? 'onderwerpmodellering' : 'topic modeling'],
                mt: ['machineTranslation', locale === 'fr' ? "traduction automatique" : locale === 'nl' ? 'machinevertaling' : 'machine translation'],
                embeddings: ['wordEmbedding', locale === 'fr' ? "plongements de mots" : locale === 'nl' ? 'woordvectoren' : 'word embeddings'],
              };
              return parts.map((part, i) => {
                const entry = wikiMap[part];
                if (entry) {
                  return (
                    <a
                      key={i}
                      href={wikiUrl(entry[0], locale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                    >
                      {entry[1]}
                    </a>
                  );
                }
                return <span key={i}>{part}</span>;
              });
            })()}
          </p>
          <p className="text-sm leading-relaxed text-slate-700">
            {(() => {
              const parts = t('home.focus.text2').split(/\{(theory|mi)\}/);
              return parts.map((part, i) => {
                if (part === 'theory')
                  return (
                    <strong key={i}>
                      {locale === 'fr'
                        ? "la théorie de l'information de Shannon"
                        : locale === 'nl'
                          ? 'Shannons informatietheorie'
                          : "Shannon's information theory"}
                    </strong>
                  );
                if (part === 'mi')
                  return (
                    <a
                      key={i}
                      href={wikiUrl('mutualInfo', locale)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                    >
                      {locale === 'fr' ? "l'information mutuelle" : locale === 'nl' ? 'wederzijdse informatie' : 'mutual information'}
                    </a>
                  );
                return <span key={i}>{part}</span>;
              });
            })()}
          </p>
        </div>
      </section>

      {/* What can you explore? */}
      <section className="mb-8 sm:mb-12">
        <h3 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-xl">
          {t('home.explore.title')}
        </h3>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            {
              title: t('home.explore.letters.title'),
              desc: t('home.explore.letters.desc'),
              color: 'bg-blue-50 border-blue-200 text-blue-800',
              to: '/analyze',
            },
            {
              title: t('home.explore.entropy.title'),
              desc: t('home.explore.entropy.desc'),
              color: 'bg-purple-50 border-purple-200 text-purple-800',
              to: '/formulas',
            },
            {
              title: t('home.explore.compare.title'),
              desc: t('home.explore.compare.desc'),
              color: 'bg-green-50 border-green-200 text-green-800',
              to: '/compare',
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`block rounded-lg border p-4 transition-shadow hover:shadow-md sm:p-5 ${item.color}`}
            >
              <h4 className="mb-1.5 text-sm font-semibold sm:mb-2 sm:text-base">{item.title}</h4>
              <p className="text-xs leading-relaxed opacity-90 sm:text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* The Corpus */}
      <section className="mb-8 sm:mb-12">
        <h3 className="mb-3 text-lg font-bold text-slate-900 sm:mb-4 sm:text-xl">
          {t('home.corpus.title')}
        </h3>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mb-6">
          {(() => {
            const parts = t('home.corpus.desc').split(/\{(strong|gutenberg)\}/);
            return parts.map((part, i) => {
              if (part === 'strong')
                return <strong key={i}>{t('home.corpus.strong')}</strong>;
              if (part === 'gutenberg')
                return (
                  <a
                    key={i}
                    href={wikiUrl('gutenberg', locale)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline decoration-blue-200 hover:text-blue-800"
                  >
                    Project Gutenberg
                  </a>
                );
              return <span key={i}>{part}</span>;
            });
          })()}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            { lang: 'Ancient Greek', authors: 'Homer, Plato, Sophocles', flag: '🏛️' },
            { lang: 'Latin', authors: 'Cicero, Caesar, Virgil', flag: '🏛️' },
            { lang: 'French', authors: 'Voltaire, Hugo, Flaubert', flag: '🇫🇷' },
            { lang: 'Dutch', authors: 'Multatuli, Couperus, Conscience', flag: '🇳🇱' },
            { lang: 'English', authors: 'Shakespeare, Austen, Dickens', flag: '🇬🇧' },
            { lang: 'Italian', authors: 'Dante, Boccaccio, Manzoni', flag: '🇮🇹' },
            { lang: 'Spanish', authors: 'Cervantes, Lope de Vega', flag: '🇪🇸' },
            { lang: 'German', authors: 'Goethe, Kafka, Schiller', flag: '🇩🇪' },
          ].map((item) => (
            <Link
              key={item.lang}
              to={`/library?lang=${encodeURIComponent(item.lang)}`}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md sm:gap-3 sm:px-4 sm:py-3"
            >
              <span className="text-lg sm:text-xl">{item.flag}</span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                  {t(`lang.${item.lang}` as Parameters<typeof t>[0])}
                </p>
                <p className="truncate text-[10px] text-slate-500 sm:text-xs">{item.authors}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Key insight */}
      <section className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-8 text-center sm:px-8 sm:py-10">
        <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
          {t('home.cta')}
        </p>
        <div className="mt-5 sm:mt-6">
          <Link
            to="/library"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 sm:px-8 sm:py-3"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
