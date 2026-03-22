import { Navigate, useLocation } from 'react-router-dom';

/**
 * 404 回首页时保留 query/hash，避免 `?mode=meditation` 在生产环境被吃掉（例如落在未声明路径上）。
 */
export default function NavigateToHomePreserveSearch() {
  const location = useLocation();
  return (
    <Navigate
      to={{ pathname: '/', search: location.search, hash: location.hash }}
      replace
    />
  );
}
