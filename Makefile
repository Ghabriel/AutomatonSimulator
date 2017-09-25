# Copyright 2016 Ghabriel Nunes <ghabriel.nunes@gmail.com>

# Folders
CSS             :=css
JS              :=js
LIB             :=lib
TS              :=scripts
LANGFOLDER      :=languages
MACHINES        :=machines
LISTS           :=$(TS)/lists
TESTS           :=$(TS)/tests

# Special files
INDEX           :=index.html
LIBSFILE        :=libs.txt
PRIORITYFILE    :=$(TS)/$(MACHINES)/priority.txt
LANGLIST        :=$(LISTS)/LanguageList.ts
CONTROLLERLIST  :=$(LISTS)/ControllerList.ts
INITLIST        :=$(LISTS)/InitializerList.ts
MACHINELIST     :=$(LISTS)/MachineList.ts
OPERATIONLIST   :=$(LISTS)/OperationList.ts
JSBASE          :=base.js
MAINFILE        :=main.js
JSTESTS         :=tests.js
MAINTS          :=$(TS)/main.ts

COMPRESS        :=1

TSFILES         :=$(shell find $(TS) -mindepth 1 -name "*.ts")
TSTESTFILES     :=$(wildcard $(TESTS)/*.ts)
ORIGNAMES       :=$(shell cat $(LIBSFILE) | sed "s/^\([^:]\+\): \(.*\)/\1/")
LIBNAMES        :=$(patsubst %, $(LIB)/%, $(ORIGNAMES))
LANGFILES       :=$(basename $(notdir $(wildcard $(TS)/$(LANGFOLDER)/*.ts)))
MACHINE_NAMES   :=$(notdir $(shell find $(TS)/$(MACHINES) -mindepth 1 -maxdepth 1 -type d))
PRIORITY        :=$(shell cat $(PRIORITYFILE))

PRIORITY        :=$(filter-out $(filter-out $(MACHINE_NAMES),$(PRIORITY)),$(PRIORITY))
MACHINE_NAMES   :=$(PRIORITY) $(filter-out $(PRIORITY),$(MACHINE_NAMES))

LISTS           :=$(CONTROLLERLIST) $(INITLIST) $(MACHINELIST) $(OPERATIONLIST)

.PHONY: all dirs libs languages machines raw simple tests clean

all: dirs libs languages machines $(JS)/$(MAINFILE)

$(JS)/$(MAINFILE): $(TSFILES)
	@echo "[.ts ⟶ .js] Translating .ts files"
	@if [ "$(TSFILES)" = "" ]; then \
		touch $(JS)/$(JSBASE); \
		truncate -s 0 $(JS)/$(JSBASE); \
	else\
		tsc --strict --sourceMap --removeComments --noImplicitReturns --module amd --outFile $(JS)/$(JSBASE) $(MAINTS); \
	fi

	@if [ "$(COMPRESS)" = "1" ]; then \
		echo "[minifying] Compressing .js file"; \
		uglifyjs $(JS)/$(JSBASE) --compress --mangle > $(JS)/$(MAINFILE) 2> /dev/null; \
	else\
		mv $(JS)/$(JSBASE) $(JS)/$(MAINFILE); \
	fi

tests: all
	@cp $(JS)/$(MAINFILE) $(JS)/$(JSTESTS)

dirs: | $(CSS) $(JS) $(LIB) $(TS) $(INDEX)

libs: | $(LIBNAMES)

languages: $(LANGLIST)

machines: $(LISTS)

raw: COMPRESS :=0
raw: all

simple:
	@tsc --module amd --outFile $(JS)/$(JSBASE) $(MAINTS)
	@cp $(JS)/$(JSBASE) $(JS)/$(MAINFILE)

$(LANGLIST): $(TS)/$(LANGFOLDER)/*.ts
	@echo "[languages] Building language list"
	@truncate -s 0 $(LANGLIST)
	@for file in $(LANGFILES); do \
		echo "export * from \"../$(LANGFOLDER)/$$file\"" >> $(LANGLIST); \
	done

$(LISTS): $(TS)/$(MACHINES) $(PRIORITYFILE)
	@echo "[aux files] Building auxiliary enums"
	@truncate -s 0 $(CONTROLLERLIST)
	@truncate -s 0 $(INITLIST)
	@truncate -s 0 $(MACHINELIST)
	@truncate -s 0 $(OPERATIONLIST)

	@printf "export enum Machine {\n\t" >> $(MACHINELIST);
	@for name in $(MACHINE_NAMES); do \
		prefix="../$(MACHINES)/$$name"; \
		operations=`find $(TS)/$(MACHINES)/$$name/operations/ -mindepth 1 2> /dev/null`; \
		mappings=""; \
		for op in $$operations; do \
			op=$${op##*/}; \
			op=$${op%.*}; \
			echo "import * as $${name}_$${op} from \"$${prefix}/operations/$${op}\"" >> $(OPERATIONLIST); \
			mappings="$${mappings}\t$${op}: $${name}_$${op},\n"; \
		done; \
		printf "\nexport let $${name} = {\n$${mappings}}\n\n" >> $(OPERATIONLIST); \
		echo "export * from \"$${prefix}/$${name}Controller\"" >> $(CONTROLLERLIST); \
		echo "export * from \"$${prefix}/initializer\"" >> $(INITLIST); \
		printf "$$name, " >> $(MACHINELIST); \
	done
	@printf "\n}\n" >> $(MACHINELIST)

$(CSS) $(JS) $(LIB) $(TS):
	@echo "[  mkdir  ] $@"
	@mkdir -p $@

$(INDEX):
	@echo "[  index  ] $@"
	@touch $(INDEX)

$(LIBNAMES):
	$(eval PURENAME=$(patsubst $(LIB)/%, %, $@))
	$(eval URL=$(shell cat $(LIBSFILE) | grep "^$(PURENAME):" | sed "s/^\([^:]\+\): \(.*\)/\2/"))
	@#"
	@echo "[   lib   ] $(PURENAME)"
	@touch $@
	@wget -O $@ -q $(URL)

clean:
	@rm -f $(JS)/*
	@rm -f $(LISTS)/*
