import 'dart:convert';
import 'dart:core';
import 'package:poosd/utils/utils.dart';
import 'package:flutter/material.dart';

class Event {

  
  final String title;
  final DateTime from;
  final DateTime to;
  final Color backgroundColor;
  late String? eventId;
  late String? userEyeD;

  Event({
    required this.title,
    required this.from,
    required this.to,
    required this.eventId,
    required this.userEyeD,
    this.backgroundColor = Colors.blue, 
  });


  Map<String, dynamic> toMap() {
    return {
      '_id' : eventId,
      'name': title,
      'description': "",
      'color': "blue",
      'tags': "",
      'isRecurring': false,
      'hasReminder': false,
      'userId': userEyeD,
      'endDate': Utils.toJsonDateTime(from),
      'startDate': Utils.toJsonDateTime(to),
    };
  }

  factory Event.fromMap(Map<String, dynamic> map) {
    return Event(
      
      title: map['name'] ?? '', 
      from: map['startDate'] ?? '', 
      to: map['endDate'] ?? '', 
      eventId: map['_id'] ?? '', 
      userEyeD: map['userId'] ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory Event.fromJson(String source) => Event.fromMap(json.decode(source));


  String? getUserId() {
    return userEyeD;
  }

  void setUserId(String s) {
    userEyeD = s;
  }

  String? getEventId() {
    return eventId;
  }
  
  void setEventId(String s) {
    eventId = s;
  }

  String getTitle() {
    return title;
  }
}