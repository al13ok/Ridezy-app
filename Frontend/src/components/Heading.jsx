function Heading({ title, subtitle }) {
  return (
    <div className="mb-7">
      <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-ink-900">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>}
    </div>
  );
}

export default Heading;
