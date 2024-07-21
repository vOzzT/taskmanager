import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;

void showSnackBar(BuildContext context, String text) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(text),
    ),
  );
}

void httpErrorHandle({
  required http.Response response,
  required BuildContext context,
  required VoidCallback onSuccess,
}) {
  switch (response.statusCode) {
    case 200:
      onSuccess();
      break;
    case 400:
      showSnackBar(context, jsonDecode(response.body)['msg']);
      break;
    case 403:
      showSnackBar(context, jsonDecode(response.body)['msg']);
      break;
    case 409:
      showSnackBar(context, jsonDecode(response.body)['msg']);
      break;
    case 410:
      showSnackBar(context, jsonDecode(response.body)['msg']);
      break;
    case 411:
      showSnackBar(context, jsonDecode(response.body)['msg']);
      break;
    case 500:
      showSnackBar(context, jsonDecode(response.body)['msg']);
      break;
    default:
      showSnackBar(context, response.body);
  }
}

class Utils {
  static String toDateTime(DateTime dateTime) {
    final date = DateFormat.yMMMEd().format(dateTime);
    final time = DateFormat.Hm().format(dateTime);

    return '$date $time';
  }

  static String toJsonDateTime(DateTime dateTime) {
    final date = DateFormat("MM-dd-yyyy").format(dateTime);
    final time = DateFormat("HH-mm-ss").format(dateTime);

    return '$date-$time';
  }

  static String toDate(DateTime dateTime) {
    final date = DateFormat.yMMMEd().format(dateTime);

    return date;
  }

  static String toTime(DateTime dateTime) {
    final time = DateFormat.Hm().format(dateTime);

    return time;
  }

  static String toHour(DateTime dateTime) {
    final time = DateFormat.jm().format(dateTime);

    return time;
  }
  
  static String toWeekDay(DateTime dateTime) {
    final time = DateFormat('EEEE').format(dateTime); 

    return time;
  }

  static DateTime removeTime(DateTime dateTime) =>
    DateTime(dateTime.year, dateTime.month, dateTime.day);
}