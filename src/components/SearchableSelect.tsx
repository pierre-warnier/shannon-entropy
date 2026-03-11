import { useState, useRef, useEffect, useMemo } from 'react';

export interface SelectOption {
  id: string;
  label: string;
  group?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  placeholder?: string;
  onChange: (id: string) => void;
}

export function SearchableSelect({
  options,
  value,
  placeholder = '',
  onChange,
}: SearchableSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive display text from selected value
  const selectedLabel = useMemo(
    () => options.find((o) => o.id === value)?.label ?? '',
    [options, value],
  );

  // Filter options by query (case-insensitive, matches anywhere)
  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.group && o.group.toLowerCase().includes(q)),
    );
  }, [options, query]);

  // Group filtered options
  const grouped = useMemo(() => {
    const groups = new Map<string, SelectOption[]>();
    for (const opt of filtered) {
      const g = opt.group ?? '';
      const arr = groups.get(g) ?? [];
      arr.push(opt);
      groups.set(g, arr);
    }
    return groups;
  }, [filtered]);

  // Flat list for keyboard navigation
  const flatFiltered = filtered;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Reset query to selected label if nothing was picked
        if (!query || query !== selectedLabel) setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query, selectedLabel]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option]');
      items[activeIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  const handleSelect = (id: string) => {
    onChange(id);
    setQuery('');
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIdx((prev) => Math.min(prev + 1, flatFiltered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIdx((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIdx >= 0 && activeIdx < flatFiltered.length) {
          handleSelect(flatFiltered[activeIdx].id);
        }
        break;
      case 'Escape':
        setOpen(false);
        setQuery('');
        setActiveIdx(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={open ? query : selectedLabel}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:px-3"
        onFocus={() => {
          setOpen(true);
          setQuery('');
          setActiveIdx(-1);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIdx(-1);
          if (!open) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />
      {/* Chevron */}
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>

      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg"
        >
          {Array.from(grouped.entries()).map(([group, items]) => (
            <li key={group}>
              {group && (
                <div className="sticky top-0 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {group}
                </div>
              )}
              {items.map((opt) => {
                const flatIdx = flatFiltered.indexOf(opt);
                return (
                  <div
                    key={opt.id}
                    data-option
                    className={`cursor-pointer px-3 py-1.5 ${
                      flatIdx === activeIdx
                        ? 'bg-blue-50 text-blue-800'
                        : opt.id === value
                          ? 'bg-slate-50 font-medium text-slate-900'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(opt.id);
                    }}
                    onMouseEnter={() => setActiveIdx(flatIdx)}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && query && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-center text-sm text-slate-400 shadow-lg">
          No match
        </div>
      )}
    </div>
  );
}
