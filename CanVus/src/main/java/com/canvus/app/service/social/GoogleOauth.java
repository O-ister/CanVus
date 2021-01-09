package com.canvus.app.service.social;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GoogleOauth implements SocialOauth {
    private String GOOGLE_SNS_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private String GOOGLE_SNS_CLIENT_ID = "1073968802049-evh62jql0f6gblp8din0t6rqv0sobg17.apps.googleusercontent.com";
    private String GOOGLE_SNS_CALLBACK_URL = "http://localhost:3000/auth/GOOGLE/callback";
    private String GOOGLE_SNS_CLIENT_SECRET = "L6w5R_1BhEi49qVpWDM3lF73";
    private String GOOGLE_SNS_TOKEN_BASE_URL = "https://oauth2.googleapis.com/token";

	@Override
	public String getOauthRedirectURL() {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("scope", "profile");
		params.put("response_type", "code");
		params.put("client_id", GOOGLE_SNS_CLIENT_ID);
		params.put("redirect_uri", GOOGLE_SNS_CALLBACK_URL);
		
		// https://accounts.google.com/o/oauth2/v2/auth?scope=profile&response_type=code&client_id=1073968802049-evh62jql0f6gblp8din0t6rqv0sobg17.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/GOOGLE/callback
		String parameterString = params.entrySet().stream().map(x -> x.getKey() + "=" + x.getValue()).collect(Collectors.joining("&"));
		
		return GOOGLE_SNS_BASE_URL + "?" + parameterString;
	}

	@Override
	public String requestAccessToken(String code) {
		try {
			URL url = new URL(GOOGLE_SNS_TOKEN_BASE_URL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			conn.setDoOutput(true);
			
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("code", code);
			params.put("client_id", GOOGLE_SNS_CLIENT_ID);
			params.put("client_secret", GOOGLE_SNS_CLIENT_SECRET);
			params.put("redirect_uri", GOOGLE_SNS_CALLBACK_URL);
			params.put("grant_type", "authorization_code");
			
			String parameterString = params.entrySet().stream().map(x-> x.getKey() + "=" + x.getValue()).collect(Collectors.joining("&"));
			
			BufferedOutputStream bous = new BufferedOutputStream(conn.getOutputStream());
			bous.write(parameterString.getBytes());
			bous.flush();
			bous.close();
			
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			
			StringBuilder sb = new StringBuilder();
			String line;
			
			while((line = br.readLine()) != null) {
				sb.append(line);
			}
			
			if (conn.getResponseCode() == 200) {
				return sb.toString();
			}
			
			return "구글 로그인 요청 처리 실패";
		} catch (Exception e) {
			// TODO: handle exception
		}
		return null;
	}

}