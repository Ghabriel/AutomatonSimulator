CSS          :=css
JS           :=js
LIB          :=lib
TS           :=scripts
INDEX        :=index.html
JSBASE       :=base.js
JSCOMPRESSED :=main.js

REQJS        :=require.js
JQUERY       :=jQuery.js

TSFILES      :=$(wildcard $(TS)/*.ts)

all: dirs libs
	@echo "[.ts ⟶ .js]"
ifneq ("$(TSFILES)", "")
	@tsc --module amd --outFile $(JS)/$(JSBASE) $(TSFILES)
else
	@touch $(JS)/$(JSBASE)
	@cat /dev/null > $(JS)/$(JSBASE)
endif
	@echo "[minifying] $(JS)/$(JSBASE) ⟶ $(JS)/$(JSCOMPRESSED)"
	@uglifyjs $(JS)/$(JSBASE) --compress --mangle > $(JS)/$(JSCOMPRESSED)

dirs: | $(CSS) $(JS) $(LIB) $(TS) $(INDEX)

libs:
ifeq ("$(wildcard $(LIB)/$(REQJS))","")
	@echo "[   lib   ] $(REQJS)"
	@touch $(LIB)/$(REQJS)
	@wget -O $(LIB)/$(REQJS) -q http://requirejs.org/docs/release/2.3.2/minified/require.js
endif

ifeq ("$(wildcard $(LIB)/$(JQUERY))","")
	@echo "[   lib   ] $(JQUERY)"
	@touch $(LIB)/$(JQUERY)
	@wget -O $(LIB)/$(JQUERY) -q https://code.jquery.com/jquery-3.1.1.min.js
endif

$(CSS) $(JS) $(LIB) $(TS):
	@echo "[  mkdir  ] $@"
	@mkdir -p $@

$(INDEX):
	@echo "[  index  ] $@"
	@touch index.html
