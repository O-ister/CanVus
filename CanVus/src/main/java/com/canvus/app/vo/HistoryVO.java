package com.canvus.app.vo;

import lombok.Data;

@Data
public class HistoryVO {
    private int history_id;
    private String user_id;
    private String feed_id;
    private String history_indate;
}
