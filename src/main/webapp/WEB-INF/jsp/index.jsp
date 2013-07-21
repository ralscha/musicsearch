<!doctype html> 
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=utf-8"%>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>MusicSearch</title>
  <link rel="icon" type="image/png" href="resources/images/favicon16.png" sizes="16x16">
  <link rel="icon" type="image/png" href="resources/images/favicon32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="resources/images/favicon48.png" sizes="48x48">
  <style>
    <%@ include file="loader.css"%>
  </style>
  ${applicationScope.app_css}
</head>
<body>
  <div id="followingBallsG">
    <div id="followingBallsG_1" class="followingBallsG"></div>
    <div id="followingBallsG_2" class="followingBallsG"></div>
    <div id="followingBallsG_3" class="followingBallsG"></div>
    <div id="followingBallsG_4" class="followingBallsG"></div>
  </div>
  
  <script>
    var app_context_path = '<%= request.getContextPath() %>';
  </script>
  ${applicationScope.app_js}	
</body>
</html>