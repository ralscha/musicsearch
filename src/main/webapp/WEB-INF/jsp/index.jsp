<!doctype html> 
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@page import="java.util.Locale"%>
<%@page import="org.springframework.web.servlet.support.RequestContextUtils"%>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta charset="utf-8">
  <link rel="shortcut icon" href="<c:url value="/favicon.ico"/>" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">	
  <title>MusicSearch</title>
  <style type="text/css">
    <%@ include file="loader.css"%>
  </style>
  <link rel="stylesheet" type="text/css" href="resources/extjs/1.0.0/resources/css/ext-all-steelblue.css">
                    
  <spring:eval expression="@environment.acceptsProfiles('development')" var="isDevelopment" />
  <c:if test="${isDevelopment}">  
    <link rel="stylesheet" type="text/css" href="resources/css/app.css">
    <link rel="stylesheet" type="text/css" href="resources/ux/css/ClearButton.css">    
  </c:if> 
    
  <c:if test="${not isDevelopment}">
    <link rel="stylesheet" type="text/css" href="wro/app-<spring:eval expression='@environment["application.version"]'/>.css" />
  </c:if>
	    	    
</head>
<body>
  <!--[if lt IE 8]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
  <div id="followingBallsG">
    <div id="followingBallsG_1" class="followingBallsG"></div>
    <div id="followingBallsG_2" class="followingBallsG"></div>
    <div id="followingBallsG_3" class="followingBallsG"></div>
    <div id="followingBallsG_4" class="followingBallsG"></div>
  </div>
	
  <c:if test="${isDevelopment}">  
    <script src="resources/extjs/<spring:eval expression='@environment["extjs.version"]'/>/ext-all-dev.js"></script>
    <script src="deft-debug.js"></script>
    <script src="loader.js"></script>    
    <script src="api.js"></script>    
    <script src="direct.js"></script>
    <script src="app/Song.js"></script>
    <script src="app.js"></script>
    <script src="soundmanager2.js"></script>
  </c:if> 
    
  <c:if test="${not isDevelopment}">
    <script src="resources/extjs/<spring:eval expression='@environment["extjs.version"]'/>/ext-all.js"></script>
    <script src="wro/app-<spring:eval expression='@environment["application.version"]'/>.js"></script>   
  </c:if>

  <% Locale locale = RequestContextUtils.getLocale(request); %>
  <% if (locale != null && locale.getLanguage().toLowerCase().equals("de")) { %>
    <script src="resources/extjs/<spring:eval expression='@environment["extjs.version"]'/>/locale/ext-lang-de.js"></script>
  <% } %>	
</body>
</html>