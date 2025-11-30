from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class FlexibleNamedPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        #detect calling view
        view = self.request.parser_context.get('view')

        #resourcs name priority:
        #1. EXPLICITY SET on the view : resources_name = "products"
        #2. use queryset model name: 'products'-> 'products'
        #3. default to 'results'
        if hasattr(view, 'resource_name'):
            resource_name = view.resource_name
        else:
            queryset = getattr(view, 'queryset', None)
            if queryset is not None and queryset.model is not None:
                resource_name = queryset.model._meta.model_name
            else:
                resource_name = 'results'

        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            resource_name: data #dynamic key (eg. 'products','categories' 'results')
        })    
       
       
    