export default function PlayPauseSVG({ color = 'white', pause }: { color?: string; pause?: boolean }) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12.5" r="12" stroke={color} />
      {pause ? (
        <>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.85294 8C8.82959 8 8 8.70515 8 9.575V15.425C8 16.2948 8.82959 17 9.85294 17C10.8763 17 11.7059 16.2948 11.7059 15.425V9.575C11.7059 8.70515 10.8763 8 9.85294 8Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.1471 8C14.1237 8 13.2941 8.70515 13.2941 9.575V15.425C13.2941 16.2948 14.1237 17 15.1471 17C16.1704 17 17 16.2948 17 15.425V9.575C17 8.70515 16.1704 8 15.1471 8Z"
            fill={color}
          />
        </>
      ) : (
        <path
          d="M9.29848 7.75319C9.29848 7.35419 9.74286 7.11593 10.0752 7.33673L17.2197 12.0837C17.5175 12.2815 17.5175 12.7188 17.2197 12.9166L10.0752 17.6636C9.74286 17.8844 9.29848 17.6461 9.29848 17.2471L9.29848 7.75319Z"
          fill={color}
          stroke={color}
        />
      )}
    </svg>
  );
}
