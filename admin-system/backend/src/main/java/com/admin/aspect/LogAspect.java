package com.admin.aspect;

import com.admin.entity.SysLog;
import com.admin.mapper.SysLogMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
public class LogAspect {

    private final SysLogMapper logMapper;
    private final ObjectMapper objectMapper;

    @Around("execution(* com.admin.controller.*.*(..))")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = point.proceed();
        long duration = System.currentTimeMillis() - startTime;

        try {
            SysLog log = new SysLog();
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                log.setUsername(auth.getName());
            }
            log.setOperation(point.getSignature().getDeclaringTypeName() + "." + point.getSignature().getName());
            log.setMethod(getRequestMethod());
            log.setParams(objectMapper.writeValueAsString(point.getArgs()));
            log.setIp(getRequestIp());
            log.setDuration(duration);
            logMapper.insert(log);
        } catch (Exception ignored) {
        }

        return result;
    }

    private String getRequestMethod() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest().getMethod() : "";
    }

    private String getRequestIp() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) return "";
        HttpServletRequest request = attrs.getRequest();
        String ip = request.getHeader("X-Forwarded-For");
        return (ip == null || ip.isEmpty()) ? request.getRemoteAddr() : ip.split(",")[0].trim();
    }
}
