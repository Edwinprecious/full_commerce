import  django_filters
from .models import Product
from django.db.models import Q


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte') #gte is greater than or equal to
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte') #lte is less than or equal to
    category = django_filters.CharFilter(method='filter_category')
    featured = django_filters.BooleanFilter(method='filter_featured')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Product
        fields = ['category', 'in_stock', 'search', 'min_price', 'max_price',  'featured']


    # def filter_category(self, queryset, name, value):
    #     if not value or value == '': #skip empty values
    #         return queryset.filter(category__id=value)
    #     return queryset.filter(category__slug=value)

    def filter_category(self, queryset, name, value):
        if not value:
            return queryset
        if str(value).isdigit():
            return queryset.filter(category__id=value)
        return queryset.filter(category__slug=value)


    def filter_featured(self, queryset, name, value):
        #only fliter if explicity true
        if value is True:
            return queryset.filter(featured=True)
        return queryset
    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(quantity__gt=0)
        return queryset

    def filter_search(self, queryset, name, value):
        if not value or value == '': #skip empty values
            return queryset
        
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(short_description__icontains=value) |
            Q(sku__icontains=value)
        )     

 