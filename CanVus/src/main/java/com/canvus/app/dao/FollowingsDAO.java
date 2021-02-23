package com.canvus.app.dao;

import com.canvus.app.dao.mapper.FollowingsMapper;
import com.canvus.app.vo.FollowingsVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Slf4j
@Repository
public class FollowingsDAO {
    @Autowired
    SqlSession session;

    /**
     * 팔로우 정보를 DB로부터 가져오는 메소드
     * 작성일: 2021.01.23 / 완성일: / 버그검증일:
     * 작성자: 이한결
     * @param id
     */
    public List<FollowingsVO> getFollow(String user_id) {
        List<FollowingsVO> followList = null;

        try {
            FollowingsMapper mapper = session.getMapper(FollowingsMapper.class);
            followList = mapper.getFollow(user_id);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("팔로우 정보 셀렉트 SQL 오류");
        }

        return followList;
    }

    public List<FollowingsVO> getFollower(String user_id) {
        List<FollowingsVO> followerList = null;

        try {
            FollowingsMapper mapper = session.getMapper(FollowingsMapper.class);
            followerList = mapper.getFollower(user_id);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("팔로우 정보 셀렉트 SQL 오류");
        }

        return followerList;

    }
}
