# myapp/parsers.py
from rest_framework.parsers import JSONParser

class CamelCaseJSONParser(JSONParser):
    def parse(self, stream, media_type=None, parser_context=None):
        data = super().parse(stream, media_type, parser_context)
        return self._convert_camel_to_snake(data)
    
    def _convert_camel_to_snake(self, data):
        if isinstance(data, dict):
            return {self._to_snake_case(key): value for key, value in data.items()}
        elif isinstance(data, list):
            return [self._convert_camel_to_snake(item) for item in data]
        return data

    def _to_snake_case(self, name):
        return ''.join(['_' + i.lower() if i.isupper() else i for i in name]).lstrip('_')
