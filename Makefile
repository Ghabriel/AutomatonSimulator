# Copyright 2016 Ghabriel Nunes <ghabriel.nunes@gmail.com>

CSS          :=css
JS           :=js
LIB          :=lib
TS           :=scripts
INDEX        :=index.html
LIBSFILE     :=libs.txt
JSBASE       :=base.js
JSCOMPRESSED :=main.js

ORIGNAMES    :=$(shell cat $(LIBSFILE) | sed "s/^\([^:]\+\): \(.*\)/\1/")
LIBNAMES     :=$(patsubst %, $(LIB)/%, $(ORIGNAMES))
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

libs: | $(LIBNAMES)

$(CSS) $(JS) $(LIB) $(TS):
	@echo "[  mkdir  ] $@"
	@mkdir -p $@

$(INDEX):
	@echo "[  index  ] $@"
	@touch $(INDEX)

$(LIBNAMES):
	$(eval PURENAME=$(patsubst $(LIB)/%, %, $@))
	$(eval URL=$(shell cat $(LIBSFILE) | grep "^$(PURENAME):" | sed "s/^\([^:]\+\): \(.*\)/\2/"))
	@echo "[   lib   ] $(PURENAME)"
	@touch $@
	@wget -O $@ -q $(URL)
