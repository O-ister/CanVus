package com.canvus.app.dao;

import com.canvus.app.dao.mapper.BookmarkMapper;
import com.canvus.app.dao.mapper.BookmarkedFeedMapper;
import com.canvus.app.dao.mapper.HistoriesMapper;
import com.canvus.app.vo.BookmarkVO;
import com.canvus.app.vo.BookmarkedFeedsVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Repository
public class BookmarkDAO {
    @Autowired
    SqlSession session;

    /**
     * 생성하려는 북마크를 db에 저장하는 메소드
     * 작성일: 2021.01.22 / 완성일: / 검증일:
     * 작성자: 이한결
     * @param inputInfo
     * @return
     */
    @Transactional(rollbackFor = {Exception.class})
    public boolean makeFolder(BookmarkVO inputInfo) {
        log.info("북마크 생성 dao 메소드 진입");

        boolean check = false;

        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            check = mapper.makeFolder(inputInfo);

        } catch (Exception e) {
            log.info("폴더만들기 SQL 오류");
        }

        return check;
    }

    /**
     * 북마크를 생성하기 전 이름 중복을 체크하는 메소드
     * 작성일: 2021.01.22 / 완성일: / 버그검증:
     * 작성자: 이한결
     * @param inputInfo
     * @return
     */
    public BookmarkVO checkDoubleNameOfBookmark(BookmarkVO inputInfo) {
        log.info("북마크 중복체크 dao 메소드 진입");
        BookmarkVO dbData = null;

        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            dbData = mapper.checkDoubleNameOfBookmark(inputInfo);
        } catch (Exception e) {
            log.info("북마크 중복체크 SQL 오류");
        }

        return dbData;
    }
    /**
     * db에 있는 북마크 정보를 제거하는 메소드
     * 작성일: 2021.01.22 / 완성일: / 버그검증:
     * 작성자: 이한결
     * @param
     * @return
     */
    public boolean deleteFolder(int folder_id) {
        log.info("북마크 폴더 제거 dao 메소드 진입");
        boolean check = false;

        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            check = mapper.deleteFolder(folder_id);
        } catch (Exception e) {
            log.info("북마크 제거 SQL오류");
        }

        return check;
    }

    /**
     * 특정 유저의 북마크 리스트를 셀렉하는 메소드
     * 작성일: 2021.02.21 / 완성일: / 버그검증일:
     * 작성자: 이한결
     * @param user_id
     * @return
     */
    public List<BookmarkVO> getBookmarkList(String user_id) {
        List<BookmarkVO> bookmarkList = null;

        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            bookmarkList = mapper.getBookmarkList(user_id);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("북마크 리스트 셀렉 sql오류");
        }

        return bookmarkList;
    }

    /**
     * AJAX 통신
     * 북마크에 해당 피드를 추가하는 메소드
     * 작성일: 2021.02.22
     * 작성자: 이한결
     */
    public boolean addFeedIntoBookmark(BookmarkedFeedsVO bmfVO) {
        boolean check = false;

        try {
            BookmarkedFeedMapper mapper = session.getMapper(BookmarkedFeedMapper.class);
            check = mapper.addFeedIntoBookmark(bmfVO);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("북마크에 추가하는 sql오류");
        }

        return check;
    }

    /**
     * 페이징을 위해서 전체 레코드 수를 불러오는 메소드
     * 작성일: 2021.02.25
     * 작성자: 이한결
     * @param user_id
     * @return
     */
    public int getTotalRecordsOnHistories(String user_id) {
        int totalRecords = 0;

        try {
            HistoriesMapper mapper = session.getMapper(HistoriesMapper.class);
            totalRecords = mapper.getTotalRecordsOnHistories(user_id);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("토탈 레코드 수 불러오기 sql오류");
        }

        return totalRecords;
    }

    /**
     * 히스토리 페이징
     * @param user_id
     * @param startRecord
     * @param countPerPage
     */
    public void getPageOfHistory(String user_id, int startRecord, int countPerPage) {

    }

    /**
     * bookmark absract 리스트를 뽑아내는 메소드
     * 2021.02.25
     * 이한결
     * @param user_id
     * @return
     */
    public List<BookmarkVO> getBookmarkFolderAbstractList(String user_id) {
        List<BookmarkVO> abstractList = null;

        try {
            BookmarkMapper mapper = session.getMapper(BookmarkMapper.class);
            abstractList = mapper.getBookmarkFolderAbstractList(user_id);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("bookmark abstract select SQL error");
        }

        return abstractList;
    }
}
