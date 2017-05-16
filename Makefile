# Copyright 2016 Ghabriel Nunes <ghabriel.nunes@gmail.com>

CSS             :=css
JS              :=js
LIB             :=lib
TS              :=scripts
INDEX           :=index.html
LIBSFILE        :=libs.txt
LISTS           :=$(TS)/lists
LANGFOLDER      :=languages
LANGLIST        :=$(LISTS)/LanguageList.ts
CONTROLLERLIST  :=$(LISTS)/ControllerList.ts
INITLIST        :=$(LISTS)/InitializerList.ts
MACHINELIST     :=$(LISTS)/MachineList.ts
MACHINES        :=machines
JSBASE          :=base.js
JSCOMPRESSED    :=main.js
COMPRESS        :=1

ORIGNAMES       :=$(shell cat $(LIBSFILE) | sed "s/^\([^:]\+\): \(.*\)/\1/")
LIBNAMES        :=$(patsubst %, $(LIB)/%, $(ORIGNAMES))
TSFILES         :=$(wildcard $(TS)/*.ts)
LANGFILES       :=$(basename $(notdir $(wildcard $(TS)/$(LANGFOLDER)/*.ts)))
MACHINE_NAMES   :=$(notdir $(shell find $(TS)/$(MACHINES) -mindepth 1 -maxdepth 1 -type d))

PRIORITY        :=$(shell cat $(TS)/$(MACHINES)/priority.txt)

.PHONY: all dirs libs languages raw simple

# all:
# 	@for name in $(PRIORITY); do \
# 		if [ -d "$(TS)/$(MACHINES)/$$name" ]; then \
# 			echo $$name; \
# 		fi \
# 	done

all: dirs libs languages machines
	@echo "[.ts ⟶ .js]"
	@if [ "$(TSFILES)" = "" ]; then \
		touch $(JS)/$(JSBASE); \
		truncate -s 0 $(JS)/$(JSBASE); \
	else\
		tsc --removeComments --noImplicitReturns --module amd --outFile $(JS)/$(JSBASE) $(TSFILES); \
	fi

	@if [ "$(COMPRESS)" = "1" ]; then \
		echo "[minifying] $(JS)/$(JSBASE) ⟶ $(JS)/$(JSCOMPRESSED)"; \
		uglifyjs $(JS)/$(JSBASE) --compress --mangle > $(JS)/$(JSCOMPRESSED) 2> /dev/null; \
	else\
		echo "[ copying ] $(JS)/$(JSBASE) ⟶ $(JS)/$(JSCOMPRESSED)"; \
		cp $(JS)/$(JSBASE) $(JS)/$(JSCOMPRESSED); \
	fi

dirs: | $(CSS) $(JS) $(LIB) $(TS) $(INDEX)

libs: | $(LIBNAMES)

languages:
	@truncate -s 0 $(LANGLIST)
	@for file in $(LANGFILES); do \
		echo "export * from \"../$(LANGFOLDER)/$$file\"" >> $(LANGLIST); \
	done

machines:
	@truncate -s 0 $(CONTROLLERLIST)
	@truncate -s 0 $(INITLIST)
	@truncate -s 0 $(MACHINELIST)

	@printf "export enum Machine {\n\t" >> $(MACHINELIST);
	@for name in $(MACHINE_NAMES); do \
		echo "export * from \"../$(MACHINES)/$$name/$${name}Controller\"" >> $(CONTROLLERLIST); \
		echo "export * from \"../$(MACHINES)/$$name/initializer\"" >> $(INITLIST); \
		printf "$$name, " >> $(MACHINELIST); \
	done
	@printf "\n}\n" >> $(MACHINELIST)

raw: COMPRESS := 0
raw: all

simple:
	@tsc --module amd --outFile $(JS)/$(JSBASE) $(TSFILES)
	@cp $(JS)/$(JSBASE) $(JS)/$(JSCOMPRESSED)

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
