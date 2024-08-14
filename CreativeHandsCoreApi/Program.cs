using CreativeHandsCoreApi.DbContexts;
using CreativeHandsCoreApi.Services;
using CreativeHandsCoreApi.Services.Mail;
using MarketCoreGeneral.Models;
using MarketCoreGeneral.Models.Authintication;
using Microsoft.EntityFrameworkCore;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File($"c:/logs/creative-hands_{DateTime.Now.ToString("dd_MM_yyyy")}.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// Add services to the container.
builder.Services.Configure<FtpSettings>(builder.Configuration.GetSection("FtpSettings"));
builder.Services.Configure<SmsSettings>(builder.Configuration.GetSection("SmsSettings"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins("http://194.36.89.39",
                                "http://creativehandsco.com", 
                                "http://localhost:4200",
                                "http://localhost:7163")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});  
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContextPool<MarketContext>(
    dbContextOptions => dbContextOptions.UseSqlServer(
        builder.Configuration["ConnectionStrings:MarketDBConnectionString"]
        ));

builder.Services.AddMemoryCache();
builder.Services.AddScoped<IMarketRepository, SqlMarketRepository>();
builder.Services.AddScoped<IOrdersRepository, OrdersRepository>();
builder.Services.AddScoped<IProductsRepository, ProductsRepository>();
builder.Services.AddScoped<IPurchaseRepository, PurchaseRepository>();
builder.Services.AddScoped<IUploadRepository, UploadRepository>();
builder.Services.AddScoped<IVideoRepository, VideoRepository>();
builder.Services.AddScoped<IFtpService, FtpService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
 
builder.Services.AddScoped<IMailService, MailService>();
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(7163); // Replace 7163 with your desired port
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

//app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
