using Jellyfin.RequestHub;
using System.Net;
using System.Text.Json;
int checks=0;
void Check(bool result,string message){if(!result)throw new Exception(message);checks++;}
var a=Guid.NewGuid();var b=Guid.NewGuid();var links=new[]{new UserLink{JellyfinUserId=a,SeerrUserId=17,AllowRequests=true}};
Check(HubPolicy.OwnMapping(links,a)?.SeerrUserId==17,"Mapped identity is selected");
Check(HubPolicy.OwnMapping(links,b)is null,"Unmapped identities never fall back to administrator");
Check(HubPolicy.OwnMapping(links,Guid.Empty)is null,"Empty identity fails closed");
foreach(var bad in new[]{"file:///etc/passwd","http://user:pass@host","https://host?key=secret","https://host/#f"}){try{HubPolicy.BaseUri(bad);throw new Exception("URL accepted");}catch(ArgumentException){checks++;}}
Check(HubPolicy.BaseUri("http://host/base").AbsoluteUri=="http://host/base/api/v1/","Base URL retains path prefix");
Check(HubPolicy.BrowsePath("search",2,"a&admin=true",null).EndsWith("query=a%26admin%3Dtrue"),"Search cannot inject upstream parameters");
try{HubPolicy.BrowsePath("../settings",1,null,null);throw new Exception("Path accepted");}catch(ArgumentException){checks++;}
Check(HubPolicy.RequestValid("movie",1,[]),"Movie requests validate");Check(HubPolicy.RequestValid("tv",1,[1,2]),"Specific seasons validate");
Check(!HubPolicy.RequestValid("tv",1,[]),"TV needs explicit seasons");Check(!HubPolicy.RequestValid("tv",1,[1,1]),"Duplicate seasons rejected");Check(!HubPolicy.RequestValid("person",1,[]),"Unsupported media rejected");
Check(HubPolicy.Poster("/image.jpg")is not null&&HubPolicy.Poster("//evil.test/image.jpg")is null,"Poster origin is restricted");
var html="<html><body></body></html>";var patched=WebMarkup.Inject(html,"0.4.0.0",true);Check(patched.Contains("../RequestHub/Assets/web.js"),"Independent browser delivery path");Check(WebMarkup.Inject(patched,"0.4.0.0",true)==patched,"No duplicate script");
using(var doc=JsonDocument.Parse("{\"id\":1,\"title\":\"Movie\",\"posterPath\":\"/image.jpg\",\"releaseDate\":\"2020-05-01\",\"voteCount\":50,\"apiKey\":\"secret\",\"requestedBy\":{\"email\":\"private\"}}")){var safe=JsonSerializer.Serialize(Projection.Item(doc.RootElement,"movie"));Check(!safe.Contains("secret")&&!safe.Contains("private"),"Projection excludes secrets and user records");Check(Projection.IsReleased(doc.RootElement,new DateOnly(2026,1,1)),"Released title with votes passes");}
using(var doc=JsonDocument.Parse("{\"id\":2,\"title\":\"Future Movie\",\"releaseDate\":\"2027-12-18\",\"voteCount\":0}")){Check(!Projection.IsReleased(doc.RootElement,new DateOnly(2026,11,6)),"Unreleased future title is excluded");}
var handler=new FakeHandler();using var gateway=new SeerrGateway(handler);
using(var doc=await gateway.Send(links[0],"discover/movies?page=1",null,CancellationToken.None)){Check(handler.User=="17"&&handler.Key=="server-secret","Upstream request always carries mapped user plus server-only key");Check(handler.Url=="http://host/api/v1/discover/movies?page=1","Fixed API base and permitted path");}
for(int i=0;i<10;i++)Check(gateway.PermitWrite(a),"Allowed write within rate cap");Check(!gateway.PermitWrite(a)&&gateway.PermitWrite(b),"Write cap is per Jellyfin user");
Console.WriteLine($"{checks} Request Hub security and delivery checks passed.");
class FakeHandler:HttpMessageHandler{public string? User,Key,Url;protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,CancellationToken token){User=request.Headers.GetValues("X-API-User").Single();Key=request.Headers.GetValues("X-API-Key").Single();Url=request.RequestUri!.AbsoluteUri;return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK){Content=new StringContent("{\"results\":[]}")});}}
