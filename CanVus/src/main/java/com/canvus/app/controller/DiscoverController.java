package com.canvus.app.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Slf4j
@Controller
@RequestMapping(value="/discover")
public class DiscoverController {

    @RequestMapping(value="/main", method= RequestMethod.GET)
    public String main() {
        return "discover/main";
    }
}