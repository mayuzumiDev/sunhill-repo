from django.http.response import HttpResponse

# Create your views here.
def test_view(request):
    return HttpResponse("Hello Admin!")

