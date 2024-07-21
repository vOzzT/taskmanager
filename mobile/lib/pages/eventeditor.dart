

import 'package:flutter/material.dart';
import 'package:poosd/models/event.dart';
import 'package:poosd/providers/event_provider.dart';
import 'package:poosd/providers/user_provider.dart';
import 'package:poosd/services/event_services.dart';
import 'package:poosd/utils/utils.dart';
import 'package:provider/provider.dart';

class EventEditingPage extends StatefulWidget {
  final Event? event;

  const EventEditingPage({
    Key? key,
    this.event,
  }) : super(key: key);

  @override
  _EventEditingPageState createState() => _EventEditingPageState();
}

class _EventEditingPageState extends State<EventEditingPage> {
  final _formKey = GlobalKey<FormState>();
  final titleController = TextEditingController();
  late DateTime fromDate;
  late DateTime toDate;

  final EventServices eventService = EventServices();

  @override
  void initState() {
    super.initState();

    if (widget.event == null) {
      fromDate = DateTime.now();
      toDate = DateTime.now().add(const Duration(hours: 1));
    } else {
      final event = widget.event!;

      titleController.text = event.title;
      fromDate = event.from;
      toDate = event.to;
    }
  }

  @override
  void dispose() {
    titleController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      leading: const CloseButton(),
      actions: buildEditingActions(),
    ),

    body: SingleChildScrollView(
      padding: const EdgeInsets.all(12),

      child: Form(
        key: _formKey,

        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            buildTitle(),
            const SizedBox(height: 12),
            buildDateTimePicker(),
          ],
        ),

      ),
    ),
  );

  List<Widget> buildEditingActions() => [
    ElevatedButton.icon(
      onPressed: saveForm,

      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
      ),
      icon: const Icon(Icons.done),
      label: const Text('Save'),
    ),
  ];

  Widget buildTitle() => TextFormField(
    style: const TextStyle(fontSize: 24),
    decoration: const InputDecoration(
      border: UnderlineInputBorder(),
      hintText: 'Add Title',
    ),
    onFieldSubmitted: (_) => saveForm,
    validator: (title) => title != null && title.isEmpty ? 'Title cannot be empty' : null,
    controller: titleController,
  );

  Widget buildDateTimePicker() => Column(
    children: [
      buildFrom(),
      buildTo(),
    ],
  ); 

  Widget buildFrom() => buildHeader(
    header: 'FROM',
    child: Row(
      children: [
        Expanded(
          flex: 2,
          child: buildDropdownField(
            text: Utils.toDate(fromDate),
            onClicked: () => pickFromDateTime(pickDate: true),
          ),
        ),

        Expanded(
          child: buildDropdownField(
            text: Utils.toTime(fromDate),
            onClicked: () => pickFromDateTime(pickDate: false),
          ),
        ),
      ],
    ),
  );

  Widget buildTo() => buildHeader(
    header: 'TO',
    child: Row(
      children: [
        Expanded(
          flex: 2,
          child: buildDropdownField(
            text: Utils.toDate(toDate),
            onClicked: () => pickToDateTime(pickDate: true),
          ),
        ),

        Expanded(
          child: buildDropdownField(
            text: Utils.toTime(toDate),
            onClicked: () => pickToDateTime(pickDate: false),
          ),
        ),
      ],
    ),
  );

  Widget buildDropdownField({
    required String text,
    required VoidCallback onClicked,
  }) => ListTile(
    title: Text(text),
    trailing: const Icon(Icons.arrow_drop_down),
    onTap: onClicked,
  );

  Widget buildHeader({
    required String header,
    required Widget child,
  }) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(header, style: const TextStyle(fontWeight: FontWeight.bold)),
      child,
    ],
  );

  Future pickFromDateTime({required bool pickDate}) async {
    final date = await pickDateTime(fromDate, pickDate: pickDate);
    if (date == null) return;

    if (date.isAfter(toDate)) {
      toDate = DateTime(date.year, date.month, date.day, toDate.hour, toDate.minute);
    }
    setState(() => fromDate = date);
  }

  Future pickToDateTime({required bool pickDate}) async {
    final date = await pickDateTime(
      toDate, 
      pickDate: pickDate,
      firstDate: pickDate ? fromDate : null,
    );

    if (date == null) return;

    if (date.isAfter(toDate)) {
      toDate = DateTime(date.year, date.month, date.day, toDate.hour, toDate.minute);
    }
    setState(() => toDate = date);
  }

  Future<DateTime?> pickDateTime(
    DateTime initialDate, {
      required bool pickDate,
      DateTime? firstDate,
  }) async {

    if (pickDate) {
      final date = await showDatePicker(
        context: context, 
        initialDate: initialDate,
        firstDate: firstDate ?? DateTime(2015, 8), 
        lastDate: DateTime(2101),
      );

      if (date == null) return null;

      final time = Duration(hours: initialDate.hour, minutes: initialDate.minute);
      return date.add(time);

    } else {
      final timeOfDay = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(initialDate),
      );

      if (timeOfDay == null) return null;

      final date = DateTime(initialDate.year, initialDate.month, initialDate.day);
      final time = Duration(hours: timeOfDay.hour, minutes: timeOfDay.minute);

      return date.add(time);
    }
  }

  Future saveForm() async {
    final isValid = _formKey.currentState!.validate();
    final user = Provider.of<UserProvider>(context, listen: false).user;

    if (isValid) {
      final event = Event(
        title: titleController.text,
        from: fromDate,
        to: toDate,
        eventId: '', 
        userEyeD: user.getId(),
      );

      final isEditing = widget.event != null;
      final provider = Provider.of<EventProvider>(context, listen: false);
      
      if (isEditing) {

        // eventService.apiEditEvent(
        //   context: context, 
        //   name: titleController.text, 
        //   endDate: toDate, 
        //   startDate: fromDate, 
        //   id: widget.event!.getEventId().toString()
        // );
        eventService.apiRemoveEvent(
          context: context, 
          eventId: widget.event!.getEventId().toString()
        );

        eventService.apiAddEvent(
          context: context, 
          name: titleController.text, 
          endDate: toDate, 
          startDate: fromDate,
        );

        provider.editEvent(event, widget.event!);

        Navigator.of(context).pop();
      } else {

        eventService.apiAddEvent(
          context: context, 
          name: titleController.text, 
          endDate: toDate, 
          startDate: fromDate,
        );

        provider.addEvent(event);
      }
      

      Navigator.of(context).pop();
    }
  }
}