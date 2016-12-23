# Copyright 2016 Ghabriel Nunes <ghabriel.nunes@gmail.com>

CSS          :=css
JS           :=js
LIB          :=lib
TS           :=scripts
INDEX        :=index.html
LIBSFILE     :=libs.txt
LANGFOLDER   :=languages
LANGLIST     :=$(TS)/lists/LanguageList.ts
JSBASE       :=base.js
JSCOMPRESSED :=main.js
COMPRESS     :=1

ORIGNAMES    :=$(shell cat $(LIBSFILE) | sed "s/^\([^:]\+\): \(.*\)/\1/")
LIBNAMES     :=$(patsubst %, $(LIB)/%, $(ORIGNAMES))
TSFILES      :=$(wildcard $(TS)/*.ts)
LANGFILES    :=$(basename $(notdir $(wildcard $(TS)/$(LANGFOLDER)/*.ts)))


.PHONY: all dirs libs languages disable_compress raw

all: dirs libs languages
	@echo "[.ts ⟶ .js]"
ifneq ("$(TSFILES)", "")
	@tsc --module amd --outFile $(JS)/$(JSBASE) $(TSFILES)
else
	@touch $(JS)/$(JSBASE)
	@cat /dev/null > $(JS)/$(JSBASE)
endif
	@if [ "$(COMPRESS)" = "1" ]; then \
		echo "[minifying] $(JS)/$(JSBASE) ⟶ $(JS)/$(JSCOMPRESSED)";\
		uglifyjs $(JS)/$(JSBASE) --compress --mangle > $(JS)/$(JSCOMPRESSED) 2> /dev/null;\
	else\
		echo "[ copying ] $(JS)/$(JSBASE) ⟶ $(JS)/$(JSCOMPRESSED)";\
		cp $(JS)/$(JSBASE) $(JS)/$(JSCOMPRESSED);\
	fi

dirs: | $(CSS) $(JS) $(LIB) $(TS) $(INDEX)

libs: | $(LIBNAMES)

languages:
	@truncate -s 0 $(LANGLIST)
	@for file in $(LANGFILES); do \
		echo "export * from \"../$(LANGFOLDER)/$$file\"" >> $(LANGLIST); \
	done

disable_compress:
	$(eval COMPRESS :=0)

raw: disable_compress all

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
