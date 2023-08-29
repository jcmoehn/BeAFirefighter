
//Autoren: Fabian

//Löscht falls vorhanden das Testfahrzeug
  $.ajax({
    type: "POST",
    url: "/deleteFahrzeug",
    data: JSON.stringify({ type : "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB"}),
    contentType: "application/json",
  });

//getdata.js
// /getfahrzeug
QUnit.test("Test /getfahrzeug ", function(assert) {
    var done = assert.async();
    console.log("In test")
    $.ajax({
        type: "GET",
        url: "/getfahrzeug",
        success: function(response) {
            console.log("in success")
            //assert.equal(response.status, 200, "Statuscode sollte 200 sein");
            assert.ok(response.result, "Ergebnis sollte vorhanden sein");
            done();
        }
    });
});


// /getstandardwerkzeuge
    QUnit.test("Test  /getstandardwerkzeuge ", function (assert) {
      const done = assert.async();
      
      $.ajax({
        url: "/getstandardwerkzeuge",
        type: "GET",
        success: function (data) {
          assert.ok(Array.isArray(data.result), "Result sollte ein array sein");
          assert.ok(data.result.length > 0, "Result sollte nicht leer sein");
          
          done();
        }
      });
    });

    //getsonderbeladung
    QUnit.test("Test /getsonderwerkzeuge ", function (assert) {
      const done = assert.async();
      
      $.ajax({
        url: "/getsonderbeladung",
        type: "GET",
        success: function (data) {
          assert.ok(Array.isArray(data.result), "Result sollte ein array sein");  
          done();
        }
      });
    });


  // /getbestandsliste
  QUnit.test('Test /getbestandsliste ', function(assert) {
    const Fahrzeugtyp = "LF 20";
    const RaumID = "2";
    const KoordinatenID = "20";
    const Fachseite = "links";
  
    const done = assert.async();
    const request = $.get(`/getbestandsliste?Fahrzeugtyp=${Fahrzeugtyp}&RaumID=${RaumID}&KoordinatenID=${KoordinatenID}&Fachseite=${Fachseite}`);
  
    request.done(function(response) {
      assert.equal(response.result.length > 0, true, "Bestandsliste erfolgreich abgerufen");
      done();
    });
  
    request.fail(function() {
      assert.ok(false, "routing fehlgeschlagen");
      done();
    });
  });


  //Zum Quiz Test LF 20
QUnit.test("Test /getzufaelligeswerkzeug ", function (assert) {
  var done = assert.async();
  var Fahrzeugtyp = "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB";

  $.ajax({
    url: "/getzufaelligeswerkzeug?Fahrzeugtyp=" + Fahrzeugtyp,
    type: "GET",
    success: function (result) {
      assert.ok(result, "Result sollte nicht leer sein");
      assert.ok(result.hasOwnProperty("result"), "Result sollte ein result-Attribut besitzen");
      done();
    }
  });
});

QUnit.test("Test '/getAntwort'", function(assert) {
  var done = assert.async();
  var params = {
    Fahrzeugtyp: 'LF 20',
    RaumID: '3',
    KoordinatenID: '37',
    Fachseite: 'links',
    Werkzeug: 'Belüftungsgerät'
  };

  $.ajax({
    url: "/getAntwort",
    type: "GET",
    data: params,
    success: function(data) {
      assert.equal(data.antwort, 'richtig', "Antwort ist richtig");
      done();
    }
  });
});

QUnit.test("Test /getAntwort2 ", function (assert) {
  let done = assert.async();
  let Fahrzeugtyp = 'LF 20';
  let RaumID = '3';
  let KoordinatenID = '37';
  let Fachseite = "links";
  
  $.ajax({
    type: "GET",
    url: "/getantwort2",
    data: {
      Fahrzeugtyp: Fahrzeugtyp,
      RaumID: RaumID,
      KoordinatenID: KoordinatenID,
      Fachseite: Fachseite
    },
    success: function (data) {
      assert.deepEqual(data, {result: [{Standardgeraet: "Belüftungsgerät"}]}, "Correct Response received");
      done();
    }
  });
});

QUnit.test("Teste LF 20 /getkorrekteantwort", function(assert) {
  var done = assert.async();
  $.ajax({
    url: "/getkorrekteantwort",
    method: "GET",
    data: {
      Fahrzeugtyp: "LF 20",
      Werkzeug: "Belüftungsgerät"
    }
  }).done(function(data) {
    assert.equal(data.result[0].Standardgeraet, "Belüftungsgerät", "Das korrekte Standardgerät wurde erhalten");
    assert.notEqual(data.result[0].Sondergeraet, "Belüftungsgerät", "Das falsche Sondergerät wurde nicht erhalten");
    assert.equal(data.result[0].Fachseite, "links", "Die korrekte Fachseite wurde erhalten");
    assert.equal(data.result[0].KoordinatenID, "37", "Die korrekten Koordinaten wurden erhalten");
    assert.equal(data.result[0].RaumID, "3", "Die korrekte RaumID wurde erhalten");
    done();
  });
});

QUnit.test("Test /getrandomFach", function (assert) {
  var done = assert.async();
  //var url = "/getrandomFach?Fahrzeugtyp=LF 20";

  $.ajax({
    url: "/getrandomFach",
    method: "GET",
    data: {
      Fahrzeugtyp: "LF 20"
    }
  }).done(function (data) {
    assert.ok(data, "Data should be truthy");
    assert.notEqual(data.result.length, 0, "Result länge sollte >0 sein");
    done();
  }).fail(function () {
    assert.ok(false, "Ajax request failed");
    done();
  });
});

QUnit.test("Test /getauswahlmoeglichkeit", function(assert) {
  var done = assert.async();
  var Fahrzeugtyp = "LF 20";
  var RaumID = "3";
  var KoordinatenID = "37";
  var Fachseite = "links";

  $.ajax({
    url: "/getauswahlmoeglichkeit",
    type: "GET",
    data: {
      Fahrzeugtyp: Fahrzeugtyp,
      RaumID: RaumID,
      KoordinatenID: KoordinatenID,
      Fachseite: Fachseite
    },
    success: function(response) {
      console.log(response);
      assert.ok(response, "Antwort empfangen");
      done();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      assert.ok(false, "Ajax-Fehler aufgetreten");
      done();
    }
  });
});


//Editor
//erstelle Fahrzeug
QUnit.test("Test /newEditorEntry", function (assert) {
  var done = assert.async();
  var expectedResponse = {"meldung": "super"};

  $.ajax({
    type: "POST",
    url: "/newEditorentry",
    data: JSON.stringify({
      type: 'Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB',
      links: {
        hitBoxen: [  ],
        zoomBoxen: [  ],
        werkzeuge: [  ]
        
      },
      rechts: { 
        hitBoxen: [[ 15.0390625, 25.036603221083457, 70.01953125, 50.073206442166914 ]], 
        zoomBoxen: [[
          [ 91.2109375, 51.68374816983894, 5.37109375, 27.525622254758417 ],
          [ 47.4609375, 87.84773060029282, 41.89453125, 10.980966325036603 ]]], 
        werkzeuge: [[[]["Abgasschlauch"],["Atemschutzgerät"]]] ,
        sonderwerkzeuge:[]},
      hinten: { 
        hitBoxen: [[ 15.0390625, 25.036603221083457, 70.01953125, 50.073206442166914 ]], 
        zoomBoxen: [], 
        werkzeuge: [] ,
        sonderwerkzeuge: [] },
      oben: { hitBoxen: null, zoomBoxen: [], werkzeuge: [], sonderwerkzeuge:[]}
    }),
    contentType: "application/json",
    success: function (response) {
      assert.deepEqual(response, expectedResponse, "Richtige Rückmeldung erhalten");
      //assert.equal(response.status, 200, "Status code should be 200 but is "+ response.status);
      done();
    }
  });
});

// /gethitboxraum

QUnit.test("Test /gethitboxraum", function (assert) {
  const done = assert.async();
  const expectedFahrzeugtyp = "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB";
  const expectedFachseite = "rechts";

  $.ajax({
    url: "/gethitboxraum?Fahrzeugtyp=" + expectedFahrzeugtyp + "&Fachseite=" + expectedFachseite,
    type: "GET",
    success: function (data) {
     // assert.equal(data.status, 200, "Status code should be 200");
      assert.ok(Array.isArray(data.result), "Result should be an array");
      assert.ok(data.result.length > 0, "Result should not be empty");

      done();
    }
  });
});

//assert.deepEqual(response, expectedResponse, "Richtige Rückmeldung erhalten");

// /gethitboxfach

QUnit.test("Test /gethitboxfach", function(assert) {
  var done = assert.async();
  
  const Fahrzeugtyp = "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB"
  const Fachseite = "rechts";
  const RaumID = 0;
  
  $.ajax({
    url: "/gethitboxfach?Fahrzeugtyp=" + Fahrzeugtyp + "&Fachseite=" + Fachseite + "&RaumID=" + RaumID,
    type: "GET",
    success: function(data) {
      //assert.equal(data.status, 200, "Status Code ist 200");
      assert.ok(data.result, "Ergebnis ist nicht leer");
      done();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      assert.ok(false, "Request fehlgeschlagen: " + textStatus + ", " + errorThrown);
      done();
    }
  });
});

//Zum Quiz für neuangelegtes Fahrzeug


QUnit.test("Test neuangelegtes Fahrzeug /getzufaelligeswerkzeug", function (assert) {
  var done = assert.async();
  var Fahrzeugtyp = "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB";

  $.ajax({
    url: "/getzufaelligeswerkzeug?Fahrzeugtyp=" + Fahrzeugtyp,
    type: "GET",
    success: function (result) {
      assert.ok(result, "Result sollte nicht leer sein");
      assert.ok(result.hasOwnProperty("result"), "Result sollte ein result-Attribut besitzen");
      done();
    }
  });
});

QUnit.test("Test neuangelegtes Fahrzeug /getAntwort", function(assert) {
  var done = assert.async();
  var params = {
    Fahrzeugtyp: 'Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB',
    RaumID: '0',
    KoordinatenID: '101',
    Fachseite: 'rechts',
    Werkzeug: 'Atemschutzgerät'
  };

  $.ajax({
    url: "/getAntwort",
    type: "GET",
    data: params,
    success: function(data) {
      assert.equal(data.antwort, 'richtig', "Antwort ist richtig");
      done();
    }
  });
});

QUnit.test("Test neuangelegtes Fahrzeug /getAntwort2 ", function (assert) {
  let done = assert.async();
  let Fahrzeugtyp = 'Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB';
  let RaumID = '0';
  let KoordinatenID = '101';
  let Fachseite = "rechts";
  
  $.ajax({
    type: "GET",
    url: "/getantwort2",
    data: {
      Fahrzeugtyp: Fahrzeugtyp,
      RaumID: RaumID,
      KoordinatenID: KoordinatenID,
      Fachseite: Fachseite
    },
    success: function (data) {
      assert.deepEqual(data, {result: [{Standardgeraet: "Atemschutzgerät"}]}, "Correct Response received");
      done();
    }
  });
});

QUnit.test("Test neuangelegtes Fahrzeug /getkorrekteantwort ", function(assert) {
  var done = assert.async();
  $.ajax({
    url: "/getkorrekteantwort",
    method: "GET",
    data: {
      Fahrzeugtyp: "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB",
      Werkzeug: "Atemschutzgerät"
    }
  }).done(function(data) {
    assert.equal(data.result[0].Standardgeraet, "Atemschutzgerät", "Das korrekte Standardgerät wurde erhalten");
    assert.notEqual(data.result[0].Sondergeraet, "Atemschutzgerät", "Das falsche Sondergerät wurde nicht erhalten");
    assert.equal(data.result[0].Fachseite, "rechts", "Die korrekte Fachseite wurde erhalten");
    assert.equal(data.result[0].KoordinatenID, "101", "Die korrekten Koordinaten wurden erhalten");
    assert.equal(data.result[0].RaumID, "0", "Die korrekte RaumID wurde erhalten");
    done();
  });
});

QUnit.test("Test neuangelegtes Fahrzeug /getrandomFach", function (assert) {
  var done = assert.async();
  //var url = "/getrandomFach?Fahrzeugtyp=LF 20";

  $.ajax({
    url: "/getrandomFach",
    method: "GET",
    data: {
      Fahrzeugtyp: "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB"
    }
  }).done(function (data) {
    assert.ok(data, "Data should be truthy");
    assert.notEqual(data.result.length, 0, "Result länge sollte >0 sein");
    done();
  }).fail(function () {
    assert.ok(false, "Ajax request failed");
    done();
  });
});

QUnit.test("Test neuangelegtes Fahrzeug /getauswahlmoeglichkeit", function(assert) {
  var done = assert.async();
  var Fahrzeugtyp = "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB";
  var RaumID = "0";
  var KoordinatenID = "101";
  var Fachseite = "rechts";

  $.ajax({
    url: "/getauswahlmoeglichkeit",
    type: "GET",
    data: {
      Fahrzeugtyp: Fahrzeugtyp,
      RaumID: RaumID,
      KoordinatenID: KoordinatenID,
      Fachseite: Fachseite
    },
    success: function(response) {
      console.log(response);
      assert.ok(response, "Antwort empfangen");
      done();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      assert.ok(false, "Ajax-Fehler aufgetreten");
      done();
    }
  });
});


//Lösche Fahrzeug
QUnit.test("Test /deleteFahrzeug", function (assert) {
  var done = assert.async();
  var expectedResponse = {"meldung" : "Erfolgreich gelöscht"};

  $.ajax({
    type: "POST",
    url: "/deleteFahrzeug",
    data: JSON.stringify({ type : "Das_Ultimative_Unit_Test_Fahrzeug_2023_BrandlöschgruppeB"}),
    contentType: "application/json",
    success: function (data) {
      assert.deepEqual(data, expectedResponse, "Richtige Rückmeldung erhalten");
      done();
    }
  });
});