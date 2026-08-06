import 'package:http/http.dart' as http

class ApiService {
  final String baseUrl = 'https://api.tindur.is/v1'

  Future<List<dynamic>> fetchExperiences(String organizationId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/organizations/$organizationId/experiences'),
    )

    if (response.statusCode == 200) {
      // Parse JSON
      return []
    } else {
      throw Exception('Failed to load experiences')
    }
  }

  Future<Map<String, dynamic>> createBooking(Map<String, dynamic> booking) async {
    final response = await http.post(
      Uri.parse('$baseUrl/bookings'),
      headers: {'Content-Type': 'application/json'},
      body: booking,
    )

    if (response.statusCode == 201) {
      return {}
    } else {
      throw Exception('Failed to create booking')
    }
  }
}
