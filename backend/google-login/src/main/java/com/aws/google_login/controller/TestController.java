package com.aws.google_login.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.ListTablesResponse;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final DynamoDbClient dynamoDbClient;

    @GetMapping("/test")
    public String test() {

        ListTablesResponse response = dynamoDbClient.listTables();

        return response.tableNames().toString();
    }
}