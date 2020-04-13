
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Controllers
{
    [Route("api/[controller]")]
    public class VersionController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Json(new {
                ThisAssembly.AssemblyVersion,
                ThisAssembly.AssemblyFileVersion,
                ThisAssembly.AssemblyInformationalVersion,
            });
        }
    }
}
