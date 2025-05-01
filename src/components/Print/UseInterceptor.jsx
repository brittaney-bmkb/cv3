// src/hooks/useEsriInterceptor.js
import { useEffect, useRef } from "react";
import esriConfig from "@arcgis/core/config";

/**
 * Registers a request interceptor and automatically cleans it up.
 * @param {string} id - Unique ID for this interceptor.
 * @param {Object} interceptor - The interceptor object (with `urls`, `before`, `after`, etc.).
 * @param {boolean} active - Whether to add the interceptor.
 */
export default function useEsriInterceptor(id, interceptor, active = true) {
  const idRef = useRef(id);

  useEffect(() => {
    if (!active) return;

    esriConfig.request.interceptors = esriConfig.request.interceptors.filter(
      (i) => i._customId !== idRef.current
    );

    const taggedInterceptor = { _customId: idRef.current, ...interceptor };
    esriConfig.request.interceptors.push(taggedInterceptor);

    return () => {
      esriConfig.request.interceptors = esriConfig.request.interceptors.filter(
        (i) => i._customId !== idRef.current
      );
    };
  }, [active, interceptor]);
}
