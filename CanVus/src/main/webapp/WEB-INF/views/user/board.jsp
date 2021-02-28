<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!-- 코어태그 사용을 위한 tablig -->
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- 로컬 파일을 불러오기 위한 taglib -->
<%@taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Board</title>
    <script>
        // 페이지에서 쓰일 전역변수 셋
        var user_id = "${userInfo.user_id}";
        var pageNo = 1;
        var totalPageCount = ${totalPageCount};
        var my_id = "${sessionScope.userId}";
    </script>
</head>

<body>
<!-- top nav -->
<jsp:include page="/WEB-INF/views/baseJSP/mainMenu.jsp"></jsp:include>

<!-- statics -->
<link rel="stylesheet" href="/resources/css/user/board/Skeleton.css">
<link rel="stylesheet" href="/resources/css/universal/gallarySkeleton.css">
<link rel="stylesheet" href="/resources/css/user/board/bookmarkshape.css">
<link rel="stylesheet" href="/resources/css/user/board/likeBtn.css?reload">
<link rel="stylesheet" href="/resources/css/user/board/board.css">
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
<script src="/resources/js/user/board/board.js"></script>

<!-- rendering part -->
<div class="container bootdey">
    <div class="content-page">
        <!-- 유저 개요( 프로필 사진 및 닉네임 표시 -->
        <div class="profile-banner" style="background:url(/resources/images/user/board/bg1.jpg);">
            <div class="row"></div>
            <div class="col-sm-3 avatar-container">
                <img src="<spring:url value='/userProfile/${userInfo.profile_photo}'/>"
                     class="img-circle profile-avatar"
                     onerror="this.src='/resources/iamges/defaults/profileDefault.png'"
                     style="width: 200px; height: 200px;">
            </div>
            <div class="col-sm-12 profile-actions text-right">
                <div class="nickname-header">
                    <h1 class="nickname-header">${userInfo.nickname}</h1>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="row center-block">
                <!-- 유저 정보 리스트 -->
                <div class="col-sm-3">
                    <div class="text-center user-profile-2" style="margin-top:120px">
                        <div class="row" id="follow-btn-container">
                            <c:if test="${not empty sessionScope.userId}">
                                <c:if test="${userInfo.user_id != sessionScope.userId}">
                                    <c:if test="${!isFollower}">
                                        <button id="follow-btn" type="button" class="btn btn-success">
                                            フォロー
                                        </button>
                                    </c:if>
                                </c:if>
                            </c:if>
                        </div>

                        <ul class="list-group">
                            <!-- 팔로워 리스트 -->
                            <div class="btn-group" style="width:100%;">
                                <button class="btn list-group-item dropdown-toggle" type="button"
                                        data-toggle="dropdown" aria-expanded="false" style="width: 100%">
                                    フォロワー
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu follow-list" role="menu"
                                    style="width:100%; text-align:center;">
                                    <c:forEach items="${followInfoPack.followerList}" var="follower">
                                        <li>
                                            <a href="/user/board/?user_id=${follower.user_id}" class="text-right">
                                                    ${follower.nickname}
                                            </a>
                                        </li>
                                    </c:forEach>
                                </ul>
                            </div>

                            <!-- 팔로우 리스트 -->
                            <div class="btn-group" style="width:100%;">
                                <button class="btn list-group-item dropdown-toggle" type="button"
                                        data-toggle="dropdown" aria-expanded="false" style="width: 100%">
                                    フォロ
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu follow-list" role="menu"
                                    style="width:100%; text-align:center;">
                                    <c:forEach items="${followInfoPack.followList}" var="following">
                                        <li>
                                            <a href="/user/board/?user_id=${following.following_id}" class="text-right">
                                                    ${following.nickname}
                                            </a>
                                        </li>
                                    </c:forEach>
                                </ul>
                            </div>

                            <!-- 누적 픽셀 정보 -->
                            <li class="list-group-item">
                                <span class="badge">${userInfo.accumulatedpixels}</span>
                                Accumulated Pixel
                            </li>
                        </ul>
                    </div>
                </div> <!-- 유저 정보 리스트 끝 -->


                <div class="col-sm-9 center-block" style="margin-top:20px;">
                    <!-- 피드 번들 파트-->
                    <div class="row center-block" id="feeds-container">
                        <c:forEach items="${bundle}" var="oneFeed" varStatus="status">
                            <div class="col-xs-6 col-sm-3 col-sm-offset-1 hover-fade feed-gallary">
                                <a href="javascript:createModal('/feed/view/?feed_id=${oneFeed.feed_id}');">
                                    <img src="<spring:url value='/userPicture/${oneFeed.pictures[0]}'/>">
                                </a>
                            </div>
                        </c:forEach>
                    </div>

                    <!-- See more 파트 -->
                    <div class="row center-block" style="margin-top:50px; margin-bottom:50px;">
                        <c:choose>
                            <c:when test="${totalPageCount > 0}">
                                <button class="btn btn-info btn-lg btn-block" id="more-btn">もっとみる！</button>
                            </c:when>
                            <c:otherwise>
                                <h1>ユーザーが描いた絵がありません。</h1>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- feed view overlay -->
<div id="feed-overlay" class="modal fade" tabindex="-1" role="dialog">
    <!-- 이곳에 피드를 불러온다. -->
</div>

<script src="/resources/js/feed/feed.js?reload"></script>
<script src="/resources/js/universal/modal.js?reload"></script>
</body>
</html>