# myapp/renderers.py
from rest_framework.renderers import JSONRenderer

class CamelCaseJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        data = self._convert_snake_to_camel(data)
        return super().render(data, accepted_media_type, renderer_context)
    
    def _convert_snake_to_camel(self, data):
        if isinstance(data, dict):
            return {self._to_camel_case(key): value for key, value in data.items()}
        elif isinstance(data, list):
            return [self._convert_snake_to_camel(item) for item in data]
        return data

    def _to_camel_case(self, name):
        parts = name.split('_')
        return parts[0] + ''.join([x.capitalize() for x in parts[1:]])
